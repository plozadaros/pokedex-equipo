import { createContext } from "react";
import type { Usuario } from "../dominio/tipos";

export interface ValorSesion {
    usuario : Usuario | null;
    // `recordar` viene de la casilla "Recordarme" del login y solo se reenvía a almacen.ts, que es
    // quien decide en qué almacén vive la sesión: aquí no se sabe si es localStorage o sessionStorage.
    entrar : (usuario : string, clave : string, recordar? : boolean) => Promise<void>;
    salir : () => void;
}

// createContext va a nivel de módulo (se crea UNA vez) y en su propio archivo: así
// SesionProvider.tsx exporta solo un componente y el refresco en caliente de Vite funciona.
export const SesionContext = createContext<ValorSesion | null>(null);
