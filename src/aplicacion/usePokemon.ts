import type { Pokemon } from "../dominio/tipos";
import { repositorio } from "./repositorio";
import { useRecurso } from "./useRecurso";

// A nivel de módulo para que su identidad sea estable entre renders. Pide al PUERTO, no a PokeAPI.
const cargarPokemon = (id : number, signal : AbortSignal) : Promise<Pokemon | null> =>
    repositorio.obtenerPokemon(id, signal);

// useParams entrega TEXTO y Number('abc') es NaN. Una clave NaN nunca es igual a sí misma, así que
// el recurso quedaría "cargando" para siempre: un id inválido se normaliza a 0, que el adaptador
// responde como "no existe" sin salir a la red.
export function usePokemon (id : number) {
    const idValido = Number.isInteger(id) && id > 0 ? id : 0;
    return useRecurso(idValido, cargarPokemon);
}
