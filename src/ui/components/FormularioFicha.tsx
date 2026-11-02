import { useState } from "react";
import { useFormulario } from "../../aplicacion/useFormulario";
import {
    LEMA_MAXIMO, REGIONES, aFicha, validarFicha,
    type FichaEntrenador, type ValoresFicha
} from "../../dominio/entrenador";
import CampoForm from "./CampoForm";

interface Props {
    inicial : ValoresFicha;
    onGuardar : (ficha : FichaEntrenador) => void;
}

// El formulario principal: controlado (value + onChange en cada campo), con validación por campo y
// mensajes junto al input, labels, envío bloqueado mientras haya errores y preventDefault. Toda
// la mecánica de valores/tocados/errores vive en useFormulario; este componente solo la usa.
export default function FormularioFicha ({ inicial, onGuardar } : Props) {
    const { valores, campo, enviar } = useFormulario<ValoresFicha>(inicial, validarFicha);
    const [guardado, setGuardado] = useState(false);

    // Al editar de nuevo, el aviso "guardada" deja de ser cierto: se apaga.
    function conAviso (nombre : keyof ValoresFicha) {
        const propiedades = campo(nombre);
        return {...propiedades, onChange : (e : Parameters<typeof propiedades.onChange>[0]) => {
            setGuardado(false);
            propiedades.onChange(e);
        }};
    }

    function guardar (v : ValoresFicha) {
        onGuardar(aFicha(v));
        setGuardado(true);
    }

    return (
        <form onSubmit={enviar(guardar)} noValidate className="flex max-w-md flex-col gap-4">
            <CampoForm etiqueta="Nombre de entrenador" autoComplete="nickname" {...conAviso('nombre')}/>
            <CampoForm etiqueta="Correo electrónico" tipo="email" autoComplete="email" {...conAviso('email')}/>
            <CampoForm etiqueta="Región de origen" tipo="select" opciones={REGIONES} {...conAviso('region')}/>
            <CampoForm etiqueta="Edad" tipo="number" {...conAviso('edad')}/>
            <CampoForm etiqueta="Tu lema (opcional)" tipo="textarea"
                ayuda={`${valores.lema.length} de ${LEMA_MAXIMO} caracteres`} {...conAviso('lema')}/>
            <div className="flex items-center gap-3">
                <button type="submit" className="rounded-full border border-slate-900 bg-slate-900 px-5 py-2 text-white">
                    Guardar ficha
                </button>
                {guardado && <p role="status" className="text-sm text-green-700">Ficha guardada ✓</p>}
            </div>
        </form>
    );
}
