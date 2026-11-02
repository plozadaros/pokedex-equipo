import { Link } from "react-router-dom";
import type { FichaEntrenador } from "../../dominio/entrenador";
import { MAX_EQUIPO } from "../../dominio/equipo";

interface Props {
    ficha : FichaEntrenador;
    pokemonEnEquipo : number;
}

// Lo guardado, a la vista: es la prueba de que el formulario "guarda algo real".
export default function TarjetaEntrenador ({ ficha, pokemonEnEquipo } : Props) {
    return (
        <article className="rounded-xl border border-slate-200 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Entrenador de {ficha.region}</p>
            <h3 className="text-xl font-bold">{ficha.nombre}</h3>
            <p className="text-sm text-slate-600">{ficha.edad} años · {ficha.email}</p>
            {ficha.lema !== '' && <p className="mt-2 italic text-slate-700">«{ficha.lema}»</p>}
            <p className="mt-3 text-sm">
                Equipo: {pokemonEnEquipo} de {MAX_EQUIPO} Pokémon ·{' '}
                <Link to="/equipo" className="underline">Ver mi equipo</Link>
            </p>
        </article>
    );
}
