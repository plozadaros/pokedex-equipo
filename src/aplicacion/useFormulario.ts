import { useState, type ChangeEvent, type FormEvent } from "react";

export type Errores<T> = Partial<Record<keyof T, string>>;

type CampoEditable = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

// El patrón de formularios de React, en UN hook reutilizable (el login y el perfil lo usan):
//  - `valores`: un objeto con todos los campos (no un useState por campo).
//  - `tocados`: qué campos visitó el usuario (onBlur). Esto SÍ es estado: no se puede calcular.
//  - `errores`: DERIVADO. validar(valores) corre en cada render: nada que sincronizar.
// Los errores solo se muestran en los campos tocados, y al enviar se marcan todos como tocados.
export function useFormulario<T extends Record<string, string>> (
    inicial : T,
    validar : (valores : T) => Errores<T>
) {
    const [valores, setValores] = useState<T>(inicial);
    const [tocados, setTocados] = useState<Partial<Record<keyof T, boolean>>>({});
    const errores = validar(valores);
    const hayErrores = Object.keys(errores).length > 0;

    // Las props de un <CampoForm>: se esparcen con {...campo('nombre')}
    function campo (nombre : keyof T & string) {
        return {
            nombre,
            valor : valores[nombre],
            onChange : (e : ChangeEvent<CampoEditable>) => {
                const nuevo = e.target.value;
                setValores((previo) => ({...previo, [nombre] : nuevo}));
            },
            onBlur : () => setTocados((previo) => ({...previo, [nombre] : true})),
            error : tocados[nombre] ? errores[nombre] : undefined
        };
    }

    // Devuelve el manejador de onSubmit. preventDefault SIEMPRE: si no, la página recarga y el
    // estado muere. Con errores no llama a `alValidar`: el envío queda bloqueado.
    function enviar (alValidar : (valores : T) => void | Promise<void>) {
        return (e : FormEvent) => {
            e.preventDefault();
            setTocados(Object.fromEntries(Object.keys(valores).map((k) => [k, true])) as Record<keyof T, boolean>);
            if(hayErrores) return;
            return alValidar(valores);
        };
    }

    function reiniciar (nuevos : T = inicial) {
        setValores(nuevos);
        setTocados({});
    }

    return {valores, errores, hayErrores, campo, enviar, reiniciar};
}
