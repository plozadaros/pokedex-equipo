import { createContext } from "react";
import type { Equipo, ResumenPokemon } from "../dominio/tipos";

export interface ValorEquipo {
    equipo : Equipo;
    cantidad : number;
    lleno : boolean;
    estaEnEquipo : (id : number) => boolean;
    alternar : (pokemon : ResumenPokemon) => void;
    quitar : (id : number) => void;
}

// A nivel de módulo (se crea UNA vez) y en su propio archivo, igual que el de la sesión.
export const EquipoContext = createContext<ValorEquipo | null>(null);
