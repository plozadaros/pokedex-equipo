import { obtenerPokemon } from "../infraestructura/pokeapi";
import { useRecurso } from "./useRecurso";

// useParams entrega TEXTO y Number('abc') es NaN. Una clave NaN nunca es igual a sí misma, así que
// el recurso quedaría "cargando" para siempre: un id inválido se normaliza a 0, que el adaptador
// responde como "no existe" sin salir a la red.
export function usePokemon (id : number) {
    const idValido = Number.isInteger(id) && id > 0 ? id : 0;
    return useRecurso(idValido, obtenerPokemon);
}
