import type { ResumenPokemon } from "../dominio/tipos";
import { repositorio } from "./repositorio";
import { useRecurso } from "./useRecurso";

// El índice no depende de ningún parámetro: la clave es fija. `cargarIndice` vive a nivel de
// módulo para que su identidad sea estable entre renders (el efecto de useRecurso depende de ella).
// Pide los datos al PUERTO (repositorio), no a PokeAPI: este hook no sabe de dónde salen.
const cargarIndice = (_clave : string, signal : AbortSignal) : Promise<ResumenPokemon[]> =>
    repositorio.obtenerIndice(signal);

export function usePokedex () {
    return useRecurso('indice', cargarIndice);
}
