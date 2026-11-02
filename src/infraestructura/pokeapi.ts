import type { Pokemon, ResumenPokemon } from "../dominio/tipos";
import { TOTAL_ESPECIES } from "../dominio/pokedex";
import { POKEAPI_URL } from "./config";

// EL ADAPTADOR: el único archivo que conoce la forma de PokeAPI. Los nombres en inglés (name,
// stats, base_stat, official-artwork...) nacen y mueren aquí; hacia adentro sale el contrato
// de dominio/tipos.ts. Cambiar de API = reescribir este archivo y nada más.

const SPRITES = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

// ---------- Forma cruda de la API (solo este archivo la usa) ----------
interface IndiceAPI {
    results : { name : string; url : string }[];
}
interface PokemonAPI {
    id : number;
    name : string;
    height : number;   // decímetros
    weight : number;   // hectogramos
    types : { type : { name : string } }[];
    stats : { base_stat : number; stat : { name : string } }[];
    abilities : { ability : { name : string } }[];
    sprites : { other? : { 'official-artwork'? : { front_default : string | null } } };
}

// ---------- Traducciones al contrato (español) ----------
const TIPOS : Record<string, string> = {
    normal : 'normal', fire : 'fuego', water : 'agua', electric : 'eléctrico', grass : 'planta',
    ice : 'hielo', fighting : 'lucha', poison : 'veneno', ground : 'tierra', flying : 'volador',
    psychic : 'psíquico', bug : 'bicho', rock : 'roca', ghost : 'fantasma', dragon : 'dragón',
    dark : 'siniestro', steel : 'acero', fairy : 'hada'
};
const ESTADISTICAS : Record<string, string> = {
    hp : 'PS', attack : 'Ataque', defense : 'Defensa', 'special-attack' : 'At. especial',
    'special-defense' : 'Def. especial', speed : 'Velocidad'
};

function idDesdeUrl (url : string) : number {
    return Number(url.split('/').filter(Boolean).at(-1));
}

function imagenPequena (id : number) : string {
    return `${SPRITES}/${id}.png`;
}

function mapearResumen (crudo : { name : string; url : string }) : ResumenPokemon {
    const id = idDesdeUrl(crudo.url);
    return { id, nombre : crudo.name, imagen : imagenPequena(id) };
}

function mapearPokemon (crudo : PokemonAPI) : Pokemon {
    return {
        id : crudo.id,
        nombre : crudo.name,
        imagen : imagenPequena(crudo.id),
        arte : crudo.sprites.other?.['official-artwork']?.front_default ?? imagenPequena(crudo.id),
        tipos : crudo.types.map((t) => TIPOS[t.type.name] ?? t.type.name),
        alturaM : crudo.height / 10,
        pesoKg : crudo.weight / 10,
        habilidades : crudo.abilities.map((a) => a.ability.name.replace(/-/g, ' ')),
        estadisticas : crudo.stats.map((s) => ({
            nombre : ESTADISTICAS[s.stat.name] ?? s.stat.name,
            valor : s.base_stat
        }))
    };
}

// ---------- Operaciones ----------
// El índice (nombre + número de las 1025 especies) pesa ~70 KB y no cambia: se pide UNA vez y se
// guarda en memoria. La búsqueda y la paginación se hacen en el cliente sobre este arreglo, y las
// imágenes del listado se deducen del id: no hay una petición por Pokémon.
let indiceEnMemoria : ResumenPokemon[] | null = null;

export async function obtenerIndice (signal? : AbortSignal) : Promise<ResumenPokemon[]> {
    if(indiceEnMemoria) return indiceEnMemoria;
    const r = await fetch(`${POKEAPI_URL}/pokemon?limit=${TOTAL_ESPECIES}`, {signal});
    if(!r.ok) throw new Error(`HTTP ${r.status}`);
    const datos = (await r.json()) as IndiceAPI;
    indiceEnMemoria = datos.results.map(mapearResumen);
    return indiceEnMemoria;
}

// Devuelve null cuando el Pokémon no existe (404): no es un fallo, es una respuesta válida que la
// página traduce a "no encontrado". Cualquier otro código sí es un error.
export async function obtenerPokemon (id : number, signal? : AbortSignal) : Promise<Pokemon | null> {
    if(!Number.isInteger(id) || id < 1) return null;
    const r = await fetch(`${POKEAPI_URL}/pokemon/${id}`, {signal});
    if(r.status === 404) return null;
    if(!r.ok) throw new Error(`HTTP ${r.status}`);
    return mapearPokemon((await r.json()) as PokemonAPI);
}
