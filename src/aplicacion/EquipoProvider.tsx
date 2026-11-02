import { useCallback, useEffect, useMemo, useReducer, type ReactNode } from "react";
import { MAX_EQUIPO, estaEnEquipo as buscarEnEquipo, reducirEquipo } from "../dominio/equipo";
import type { Equipo } from "../dominio/tipos";
import { guardarEquipo, leerEquipo } from "../infraestructura/almacen";
import { EquipoContext, type ValorEquipo } from "./contexto-equipo";
import { useSesion } from "./useSesion";

interface PropsEquipo {
    usuarioId : number | null;
    children : ReactNode;
}

// Sin sesión no hay equipo: arranca vacío y no toca el disco.
function equipoInicial (usuarioId : number | null) : Equipo {
    return usuarioId === null ? [] : leerEquipo(usuarioId);
}

function EquipoDeUsuario ({usuarioId, children} : PropsEquipo) {
    const [equipo, despachar] = useReducer(reducirEquipo, usuarioId, equipoInicial);

    // Persistir es tocar el disco: un efecto con [equipo]. La lectura (arriba) es el inicializador
    // del reductor, con su aduana dentro de almacen.ts.
    useEffect(() => {
        if(usuarioId !== null) guardarEquipo(usuarioId, equipo);
    }, [usuarioId, equipo]);

    // `despachar` es estable: estas funciones también, y por eso memo(TarjetaPokemon) sirve de algo.
    const alternar = useCallback<ValorEquipo['alternar']>((pokemon) => despachar({tipo : 'alternar', pokemon}), []);
    const quitar = useCallback<ValorEquipo['quitar']>((id) => despachar({tipo : 'quitar', id}), []);

    // Los derivados (cantidad, lleno) se calculan del arreglo: no son estado que sincronizar.
    const valor = useMemo<ValorEquipo>(() => ({
        equipo,
        cantidad : equipo.length,
        lleno : equipo.length >= MAX_EQUIPO,
        estaEnEquipo : (id) => buscarEnEquipo(equipo, id),
        alternar,
        quitar
    }), [equipo, alternar, quitar]);

    return (
        <EquipoContext.Provider value={valor}>
            {children}
        </EquipoContext.Provider>
    );
}

// Cada usuario tiene su equipo. La `key` hace que, al entrar o salir una cuenta, React DESMONTE el
// equipo anterior y monte uno nuevo que lee el disco de ese usuario: no hay que sincronizar nada a mano.
export function EquipoProvider ({children} : {children : ReactNode}) {
    const { usuario } = useSesion();
    return (
        <EquipoDeUsuario key={usuario?.id ?? 'sin-sesion'} usuarioId={usuario?.id ?? null}>
            {children}
        </EquipoDeUsuario>
    );
}
