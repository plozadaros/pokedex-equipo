import { useContext } from "react";
import { SesionContext } from "./contexto-sesion";

// Hook propio: lee el contexto y comprueba que el Provider exista, para que el error sea un mensaje
// exacto y no un "cannot read properties of null" lejos del culpable.
export function useSesion () {
    const contexto = useContext(SesionContext);
    if(!contexto) throw new Error('useSesion solo funciona dentro de <SesionProvider>');
    return contexto;
}
