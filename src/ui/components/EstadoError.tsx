interface Props {
    mensaje : string;
    onReintentar : () => void;
}

// El estado de error de toda carga: dice qué pasó (sin pantalla en blanco ni catch vacío) y
// ofrece una salida, "Reintentar", que vuelve a pedir el recurso.
export default function EstadoError ({ mensaje, onReintentar } : Props) {
    return (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-semibold text-red-900">{mensaje}</p>
            <p className="mt-1 text-sm text-red-800">Revisa tu conexión e inténtalo de nuevo.</p>
            <button className="mt-3 rounded-full border border-red-300 bg-white px-4 py-1 text-sm hover:bg-red-100"
                onClick={onReintentar}>
                Reintentar
            </button>
        </div>
    );
}
