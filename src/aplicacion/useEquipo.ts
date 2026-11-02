import { useContext } from "react";
import { EquipoContext } from "./contexto-equipo";

// Segundo hook propio: lee el contexto y comprueba que el Provider exista.
export function useEquipo () {
    const contexto = useContext(EquipoContext);
    if(!contexto) throw new Error('useEquipo solo funciona dentro de <EquipoProvider>');
    return contexto;
}
