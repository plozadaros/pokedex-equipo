import type { ChangeEvent } from "react";

type CampoEditable = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

interface Props {
    etiqueta : string;
    nombre : string;
    valor : string;
    onChange : (e : ChangeEvent<CampoEditable>) => void;
    onBlur : () => void;
    error? : string;
    tipo? : 'text' | 'password' | 'email' | 'number' | 'select' | 'textarea';
    opciones? : string[];
    ayuda? : string;
    autoComplete? : string;
}

const CLASE_CAMPO = 'rounded border border-slate-300 px-3 py-2 aria-[invalid=true]:border-red-500';

// Un campo de formulario completo (etiqueta + control + mensaje de error), para no repetir el mismo
// bloque cuatro veces por pantalla. Recibe lo que entrega campo() de useFormulario. El error se pega
// al campo con aria-describedby y el control se marca aria-invalid: lo lee un lector de pantalla.
export default function CampoForm ({ etiqueta, nombre, valor, onChange, onBlur, error, tipo = 'text', opciones = [], ayuda, autoComplete } : Props) {
    const idMensaje = `${nombre}-mensaje`;
    const comunes = {
        id : nombre,
        name : nombre,
        value : valor,
        onChange,
        onBlur,
        'aria-invalid' : error ? true : undefined,
        'aria-describedby' : error || ayuda ? idMensaje : undefined,
        className : CLASE_CAMPO
    };
    return (
        <div className="flex flex-col gap-1 text-sm">
            <label htmlFor={nombre} className="font-medium">{etiqueta}</label>
            {tipo === 'select' ? (
                <select {...comunes}>
                    <option value="">Elige una opción</option>
                    {opciones.map((opcion) => <option key={opcion} value={opcion}>{opcion}</option>)}
                </select>
            ) : tipo === 'textarea' ? (
                <textarea {...comunes} rows={3}/>
            ) : (
                <input {...comunes} type={tipo} autoComplete={autoComplete}/>
            )}
            {error ? (
                <p id={idMensaje} className="text-xs text-red-600">{error}</p>
            ) : ayuda ? (
                <p id={idMensaje} className="text-xs text-slate-500">{ayuda}</p>
            ) : null}
        </div>
    );
}
