import type { Equipo, ResumenPokemon } from "./tipos";

// Reglas puras del equipo, igual que carrito.ts en la tienda: reciben datos y devuelven datos.
// Ni React, ni red, ni disco. La regla de negocio es esta: un equipo tiene como máximo SEIS
// Pokémon y no puede repetirlos.
export const MAX_EQUIPO = 6;

export type MotivoRechazo = 'lleno' | 'repetido';

export function estaEnEquipo (equipo : Equipo, id : number) : boolean {
    return equipo.some((miembro) => miembro.id === id);
}

export function motivoRechazo (equipo : Equipo, id : number) : MotivoRechazo | null {
    if(estaEnEquipo(equipo, id)) return 'repetido';
    if(equipo.length >= MAX_EQUIPO) return 'lleno';
    return null;
}

// Si la regla lo impide devuelve el MISMO equipo (sin cambios); si no, uno nuevo. Nunca muta.
// Copia solo lo que el equipo necesita: así no se guarda el detalle completo de un Pokémon.
export function agregarMiembro (equipo : Equipo, pokemon : ResumenPokemon) : Equipo {
    if(motivoRechazo(equipo, pokemon.id) !== null) return equipo;
    return [...equipo, {id : pokemon.id, nombre : pokemon.nombre, imagen : pokemon.imagen}];
}

export function quitarMiembro (equipo : Equipo, id : number) : Equipo {
    return equipo.filter((miembro) => miembro.id !== id);
}

export type AccionEquipo =
    | {tipo : 'alternar'; pokemon : ResumenPokemon}
    | {tipo : 'quitar'; id : number};

// El reductor de useReducer: recibe SIEMPRE el estado más reciente, así dos clics seguidos parten
// del resultado del anterior. "Alternar" agrega si no está y quita si ya está.
export function reducirEquipo (equipo : Equipo, accion : AccionEquipo) : Equipo {
    switch(accion.tipo) {
        case 'alternar' :
            return estaEnEquipo(equipo, accion.pokemon.id)
                ? quitarMiembro(equipo, accion.pokemon.id)
                : agregarMiembro(equipo, accion.pokemon);
        case 'quitar' :
            return quitarMiembro(equipo, accion.id);
    }
}
