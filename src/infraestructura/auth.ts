import type { Usuario } from "../dominio/tipos";
import { AUTH_URL } from "./config";

// Sesión con JWT contra DummyJSON (POST /auth/login y GET /auth/me). La forma cruda de la
// respuesta (accessToken, firstName...) vive solo aquí.
const MINUTOS_SESION = 30;

interface RespuestaLogin {
    id : number;
    username : string;
    firstName? : string;
    email : string;
    accessToken : string;
}

export async function iniciarSesion (usuario : string, clave : string, signal? : AbortSignal) : Promise<Usuario> {
    let r : Response;
    try {
        r = await fetch(`${AUTH_URL}/auth/login`, {
            method : 'POST',
            headers : { 'Content-Type' : 'application/json' },
            body : JSON.stringify({ username : usuario, password : clave, expiresInMins : MINUTOS_SESION }),
            signal
        });
    } catch (error) {
        if(error instanceof DOMException && error.name === 'AbortError') throw error;
        throw new Error('No pudimos conectar con el servidor de sesion. Revisa tu conexion.');
    }
    // La clave viaja en el cuerpo del POST y se olvida: nunca se guarda ni se muestra.
    if(r.status === 400 || r.status === 401) throw new Error('Usuario o contraseña incorrectos');
    if(!r.ok) throw new Error(`El servidor de sesion respondio ${r.status}`);
    const datos = (await r.json()) as RespuestaLogin;
    return {
        id : datos.id,
        nombre : datos.firstName || datos.username,
        email : datos.email,
        token : datos.accessToken,
        expiraEn : Date.now() + MINUTOS_SESION * 60 * 1000
    };
}

// El token se USA: viaja en el header Authorization (nunca en la URL). Quien decide si todavía
// vale es el servidor; si lo rechaza, la sesión se cierra.
export async function validarToken (token : string, signal? : AbortSignal) : Promise<void> {
    const r = await fetch(`${AUTH_URL}/auth/me`, {
        headers : { 'Authorization' : `Bearer ${token}` },
        signal
    });
    if(!r.ok) throw new Error(`Sesion rechazada por el servidor (HTTP ${r.status})`);
}
