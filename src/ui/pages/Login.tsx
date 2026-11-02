import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSesion } from "../../aplicacion/useSesion";
import { useFormulario, type Errores } from "../../aplicacion/useFormulario";
import CampoForm from "../components/CampoForm";
import { NOMBRE_APP } from "../marca";
import { useTitulo } from "../useTitulo";

type ValoresLogin = { usuario : string; clave : string };

// Validación por campo: mensajes propios junto al input, no solo los atributos nativos.
function validar (v : ValoresLogin) : Errores<ValoresLogin> {
    const errores : Errores<ValoresLogin> = {};
    if(v.usuario.trim() === '') errores.usuario = 'Escribe tu usuario';
    if(v.clave === '') errores.clave = 'Escribe tu contraseña';
    return errores;
}

export default function Login () {
    const { entrar } = useSesion();
    const navegar = useNavigate();
    const ubicacion = useLocation();
    // La ruta protegida mandó aquí con state.desde: se vuelve a donde se iba (o al inicio).
    const desde = (ubicacion.state as {desde? : string} | null)?.desde ?? '/';
    const { campo, enviar } = useFormulario<ValoresLogin>({usuario : '', clave : ''}, validar);
    // Encendida, la sesión sobrevive al cierre del navegador; apagada, muere con la pestaña.
    const [recordar, setRecordar] = useState(true);
    const [errorServidor, setErrorServidor] = useState('');
    const [enviando, setEnviando] = useState(false);
    useTitulo(`Iniciar sesión - ${NOMBRE_APP}`);

    async function iniciar (v : ValoresLogin) {
        setErrorServidor('');
        setEnviando(true);
        try {
            await entrar(v.usuario.trim(), v.clave, recordar);
            navegar(desde, {replace : true});
        } catch (error) {
            setErrorServidor(error instanceof Error ? error.message : 'No se pudo iniciar sesión.');
        } finally {
            setEnviando(false);
        }
    }

    return (
        <form onSubmit={enviar(iniciar)} noValidate className="mx-auto flex max-w-sm flex-col gap-4 py-6">
            <h1 className="text-2xl font-bold">Inicia sesión</h1>
            <p className="text-sm text-slate-600">
                Para armar tu equipo necesitas una cuenta. La sesión la maneja DummyJSON; el usuario de
                prueba está en el README del proyecto.
            </p>
            <CampoForm etiqueta="Usuario" autoComplete="username" {...campo('usuario')}/>
            <CampoForm etiqueta="Contraseña" tipo="password" autoComplete="current-password" {...campo('clave')}/>
            <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={recordar} onChange={(e) => setRecordar(e.target.checked)}/>
                Recordarme en este equipo
            </label>
            {errorServidor && <p role="alert" className="text-sm text-red-600">{errorServidor}</p>}
            <button type="submit" disabled={enviando}
                className="rounded-full border border-slate-900 bg-slate-900 px-4 py-2 text-white disabled:opacity-60">
                {enviando ? 'Entrando...' : 'Entrar'}
            </button>
        </form>
    );
}
