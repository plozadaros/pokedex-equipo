import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Usuario } from "../dominio/tipos";
import { iniciarSesion, validarToken } from "../infraestructura/auth";
import { borrarSesion, guardarSesion, leerSesion } from "../infraestructura/almacen";
import { SesionContext, type ValorSesion } from "./contexto-sesion";

export function SesionProvider ({children} : {children : ReactNode}) {
    // Se lee del disco UNA vez, al arrancar (inicializador perezoso), con la aduana dentro de almacen.ts.
    const [usuario, setUsuario] = useState<Usuario | null>(leerSesion);

    const cerrar = useCallback(() => {
        borrarSesion();
        setUsuario(null);
    }, []);

    const entrar = useCallback(async (nombre : string, clave : string, recordar = true) => {
        const conectado = await iniciarSesion(nombre, clave);
        guardarSesion(conectado, recordar);
        setUsuario(conectado);
    }, []);

    // Una sesión guardada puede estar vencida o anulada. Tres comprobaciones al arrancar o al entrar:
    //  1. el servidor decide si el token todavía vale (GET /auth/me con Authorization: Bearer),
    //  2. un temporizador cierra la sesión en el instante en que vence (expiraEn),
    //  3. la limpieza cancela la petición y el temporizador si el usuario cambia o se desmonta.
    useEffect(() => {
        if(!usuario) return;
        const restante = usuario.expiraEn - Date.now();
        const controlador = new AbortController();
        if(restante > 0) {
            validarToken(usuario.token, controlador.signal).catch((error : unknown) => {
                if(error instanceof DOMException && error.name === 'AbortError') return;
                console.warn('La sesion guardada ya no es valida');
                cerrar();
            });
        }
        // Si ya venció, el temporizador de 0 ms la cierra: no se hace setState dentro del propio efecto.
        const temporizador = setTimeout(cerrar, Math.max(restante, 0));
        return () => {
            controlador.abort();
            clearTimeout(temporizador);
        };
    }, [usuario, cerrar]);

    // useMemo: el objeto del contexto solo cambia cuando cambia algo de lo que lleva, así los
    // consumidores no se repintan por un render del Provider que no les afecta.
    const valor = useMemo<ValorSesion>(() => ({usuario, entrar, salir : cerrar}), [usuario, entrar, cerrar]);
    return (
        <SesionContext.Provider value={valor}>
            {children}
        </SesionContext.Provider>
    );
}
