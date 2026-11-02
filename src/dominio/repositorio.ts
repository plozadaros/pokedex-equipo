import type { Pokemon, ResumenPokemon } from "./tipos";

// EL PUERTO: lo que la aplicación NECESITA saber pedir sobre Pokémon, dicho en el idioma del
// dominio y sin nada de red. Es una interfaz: no dice DE DÓNDE salen los datos.
//  - Los hooks de aplicacion/ dependen de ESTA interfaz, nunca de PokeAPI.
//  - infraestructura/pokeapi.ts la implementa (el adaptador real) y
//    infraestructura/repositorioEnMemoria.ts la implementa con datos fijos (para pruebas y trabajo sin red).
//  - aplicacion/repositorio.ts es el ÚNICO lugar que elige cuál implementación se usa.
// Cambiar de API (o de fuente de datos) = escribir otra implementación y cambiar UNA línea.
export interface RepositorioPokemon {
    // Todas las especies, con lo mínimo para el listado.
    obtenerIndice (signal? : AbortSignal) : Promise<ResumenPokemon[]>;
    // El detalle de uno, o null si no existe (no es un error, es una respuesta válida).
    obtenerPokemon (id : number, signal? : AbortSignal) : Promise<Pokemon | null>;
}
