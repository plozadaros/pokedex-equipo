import { useCallback, useState } from "react";
import type { FichaEntrenador } from "../dominio/entrenador";
import { guardarFicha, leerFicha } from "../infraestructura/almacen";

// Hook propio: la ficha del entrenador de un usuario. Se lee del disco UNA vez al montar (con su
// aduana dentro de almacen.ts) y se guarda como CONSECUENCIA de enviar el formulario: persistir
// ahí, en el manejador del evento, evita un efecto que copie el estado al disco en cada render.
export function useFicha (usuarioId : number) {
    const [ficha, setFicha] = useState<FichaEntrenador | null>(() => leerFicha(usuarioId));
    const guardar = useCallback((nueva : FichaEntrenador) => {
        guardarFicha(usuarioId, nueva);
        setFicha(nueva);
    }, [usuarioId]);
    return {ficha, guardar};
}
