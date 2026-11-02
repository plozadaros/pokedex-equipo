import type { Pokemon, ResumenPokemon } from "../dominio/tipos";
import type { RepositorioPokemon } from "../dominio/repositorio";

// Una SEGUNDA implementación del puerto, con datos fijos y sin red. Existe para dos cosas:
//  1. probar que la aplicación depende de la interfaz y no de PokeAPI (se puede cambiar la fuente
//     sin tocar hooks ni pantallas: ver aplicacion/repositorio.ts), y
//  2. servir de doble en pruebas y para trabajar sin conexión.
const POKEMON : Pokemon[] = [
    {id : 1, nombre : 'bulbasaur', imagen : '', arte : '', tipos : ['planta', 'veneno'], alturaM : 0.7, pesoKg : 6.9,
        habilidades : ['overgrow'], estadisticas : [{nombre : 'PS', valor : 45}, {nombre : 'Ataque', valor : 49}]},
    {id : 4, nombre : 'charmander', imagen : '', arte : '', tipos : ['fuego'], alturaM : 0.6, pesoKg : 8.5,
        habilidades : ['blaze'], estadisticas : [{nombre : 'PS', valor : 39}, {nombre : 'Ataque', valor : 52}]},
    {id : 7, nombre : 'squirtle', imagen : '', arte : '', tipos : ['agua'], alturaM : 0.5, pesoKg : 9.0,
        habilidades : ['torrent'], estadisticas : [{nombre : 'PS', valor : 44}, {nombre : 'Ataque', valor : 48}]},
];

export const repositorioEnMemoria : RepositorioPokemon = {
    async obtenerIndice () : Promise<ResumenPokemon[]> {
        return POKEMON.map(({id, nombre, imagen}) => ({id, nombre, imagen}));
    },
    async obtenerPokemon (id : number) : Promise<Pokemon | null> {
        return POKEMON.find((p) => p.id === id) ?? null;
    }
};
