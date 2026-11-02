import type { Usuario } from "../dominio/tipos";

// El disco del navegador. Todo lo que sale de aquí entra como `unknown` y pasa por una "aduana":
// se comprueba su forma antes de usarlo, porque pudo escribirlo otra versión de la app o el
// propio usuario desde las herramientas del navegador.
const CLAVE_SESION = 'pokedex_sesion';

// ---------- Sesión ----------
function esUsuario (crudo : unknown) : crudo is Usuario {
    if(typeof crudo !== 'object' || crudo === null) return false;
    const u = crudo as Partial<Usuario>;
    return typeof u.id === 'number' && typeof u.nombre === 'string' && typeof u.email === 'string'
        && typeof u.token === 'string' && typeof u.expiraEn === 'number';
}

function leerSesionDe (almacen : Storage) : Usuario | null {
    try {
        const crudo : unknown = JSON.parse(almacen.getItem(CLAVE_SESION) ?? 'null');
        return esUsuario(crudo) ? crudo : null;
    } catch {
        return null;
    }
}

// "Recordarme": encendida, la sesión va a localStorage (sobrevive al cierre del navegador);
// apagada, a sessionStorage (muere con la pestaña). La decisión de DÓNDE se guarda vive solo aquí.
export function leerSesion () : Usuario | null {
    try {
        return leerSesionDe(sessionStorage) ?? leerSesionDe(localStorage);
    } catch {
        return null;
    }
}

export function guardarSesion (usuario : Usuario, recordar = true) {
    try {
        const destino = recordar ? localStorage : sessionStorage;
        const otro = recordar ? sessionStorage : localStorage;
        otro.removeItem(CLAVE_SESION); // nunca la misma sesión en los dos almacenes a la vez
        destino.setItem(CLAVE_SESION, JSON.stringify(usuario));
    } catch {
        console.warn('No se pudo guardar la sesion');
    }
}

export function borrarSesion () {
    try {
        localStorage.removeItem(CLAVE_SESION);
        sessionStorage.removeItem(CLAVE_SESION);
    } catch {
        console.warn('No se pudo borrar la sesion');
    }
}
