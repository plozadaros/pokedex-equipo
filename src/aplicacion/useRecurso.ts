import { useCallback, useEffect, useState } from "react";
import type { EstadoCarga } from "../dominio/tipos";

interface Resultado<K, T> {
    clave : K;
    intento : number;
    estado : 'listo' | 'error';
    datos : T | null;
}

// Pide un recurso a la red con los TRES estados honestos (cargando / listo / error) y "Reintentar".
//  - El fetch vive en un efecto (toca la red). El AbortController viaja hasta el fetch y la
//    limpieza lo cancela: si el componente se desmonta o cambia la clave, la petición vieja se
//    cancela y su respuesta nunca pisa a la nueva. AbortError no es un fallo: es la orden cumplida.
//  - El estado NO se guarda: se DERIVA. `resultado` recuerda de qué clave e intento es la respuesta;
//    si no coincide con la clave actual, el recurso está "cargando". Así, al cambiar de Pokémon no
//    hay un instante mostrando los datos del anterior ni un setState dentro del efecto.
// `cargar` debe ser una función estable (de módulo): el efecto depende de ella.
export function useRecurso<K extends string | number, T> (
    clave : K,
    cargar : (clave : K, signal : AbortSignal) => Promise<T>
) {
    const [resultado, setResultado] = useState<Resultado<K, T> | null>(null);
    const [intento, setIntento] = useState(0);

    useEffect(() => {
        const controlador = new AbortController();
        cargar(clave, controlador.signal).then(
            (datos) => setResultado({clave, intento, estado : 'listo', datos}),
            (error : unknown) => {
                if(error instanceof DOMException && error.name === 'AbortError') return;
                console.warn('No se pudo cargar el recurso:', error instanceof Error ? error.message : error);
                setResultado({clave, intento, estado : 'error', datos : null});
            }
        );
        return () => controlador.abort();
    }, [clave, cargar, intento]);

    const vigente = resultado !== null && resultado.clave === clave && resultado.intento === intento;
    const estado : EstadoCarga = vigente ? resultado.estado : 'cargando';
    const datos = vigente ? resultado.datos : null;
    const reintentar = useCallback(() => setIntento((i) => i + 1), []);
    return {estado, datos, reintentar};
}
