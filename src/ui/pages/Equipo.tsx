import { Link } from "react-router-dom";
import { MAX_EQUIPO } from "../../dominio/equipo";
import { useEquipo } from "../../aplicacion/useEquipo";
import { capitalizar, formatearNumero } from "../formato";
import { NOMBRE_APP } from "../marca";
import { useTitulo } from "../useTitulo";

// La colección del usuario (ruta protegida). Lee del contexto: no toca el disco ni la red.
export default function Equipo () {
    const { equipo, cantidad, quitar } = useEquipo();
    useTitulo(`Mi equipo (${cantidad}/${MAX_EQUIPO}) - ${NOMBRE_APP}`);
    // Derivado: los espacios libres hasta completar los seis, solo para dibujarlos.
    const libres = Array.from({length : MAX_EQUIPO - cantidad});

    return (
        <section>
            <h1 className="text-3xl font-bold">Mi equipo</h1>
            <p className="mt-1 text-slate-600" aria-live="polite">{cantidad} de {MAX_EQUIPO} Pokémon</p>

            {cantidad === 0 && (
                <div className="mt-5 rounded-xl border border-slate-200 p-6">
                    <p className="text-slate-600">Tu equipo está vacío. Elige hasta seis Pokémon desde el Pokédex.</p>
                    <Link to="/" className="mt-2 inline-block underline">Ir al Pokédex</Link>
                </div>
            )}

            <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {equipo.map((miembro) => (
                    <li key={miembro.id}>
                        <article className="flex flex-col items-center rounded-xl border border-slate-200 p-3 text-center">
                            <Link to={`/pokemon/${miembro.id}`} className="block">
                                <img src={miembro.imagen} alt={`Sprite de ${capitalizar(miembro.nombre)}`} width={96} height={96}
                                    className="mx-auto h-24 w-24 [image-rendering:pixelated]"/>
                                <p className="mt-1 text-xs text-slate-500">{formatearNumero(miembro.id)}</p>
                                <h2 className="font-semibold">{capitalizar(miembro.nombre)}</h2>
                            </Link>
                            <button className="mt-3 rounded-full border border-slate-400 px-4 py-1 text-sm hover:bg-slate-100"
                                onClick={() => quitar(miembro.id)}
                                aria-label={`Quitar a ${capitalizar(miembro.nombre)} del equipo`}>
                                Quitar
                            </button>
                        </article>
                    </li>
                ))}
                {cantidad > 0 && libres.map((_, indice) => (
                    <li key={`libre-${indice}`} aria-hidden="true"
                        className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-slate-300 text-sm text-slate-400">
                        Espacio libre
                    </li>
                ))}
            </ul>
        </section>
    );
}
