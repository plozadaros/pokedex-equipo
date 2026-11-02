import type { ResumenPokemon } from "../dominio/tipos";
import { obtenerIndice } from "../infraestructura/pokeapi";
import { useRecurso } from "./useRecurso";

// El índice no depende de ningún parámetro: la clave es fija. `cargarIndice` vive a nivel de
// módulo para que su identidad sea estable entre renders (el efecto de useRecurso depende de ella).
const cargarIndice = (_clave : string, signal : AbortSignal) : Promise<ResumenPokemon[]> => obtenerIndice(signal);

export function usePokedex () {
    return useRecurso('indice', cargarIndice);
}
