import { Link, useParams } from "react-router-dom";
import { usePokemon } from "../../aplicacion/usePokemon";
import { TOTAL_ESPECIES } from "../../dominio/pokedex";
import BarraEstadistica from "../components/BarraEstadistica";
import EstadoError from "../components/EstadoError";
import EtiquetaTipo from "../components/EtiquetaTipo";
import SkeletonDetalle from "../components/SkeletonDetalle";
import { capitalizar, formatearDecimal, formatearNumero } from "../formato";
import { NOMBRE_APP } from "../marca";
import { useTitulo } from "../useTitulo";

export default function Detalle () {
    // useParams entrega TEXTO ('25'): se convierte con Number antes de pedirlo.
    const { id } = useParams();
    const numero = Number(id);
    const { estado, datos : pokemon, reintentar } = usePokemon(numero);

    // El título lleva el nombre del Pokémon: derivado de lo que hay en pantalla. Los hooks van ANTES de los return.
    useTitulo(
        pokemon ? `${capitalizar(pokemon.nombre)} ${formatearNumero(pokemon.id)} - ${NOMBRE_APP}`
        : estado === 'cargando' ? `Cargando... - ${NOMBRE_APP}`
        : estado === 'error' ? `Error - ${NOMBRE_APP}`
        : `Pokémon no encontrado - ${NOMBRE_APP}`
    );

    if(estado === 'cargando') return <SkeletonDetalle/>;
    if(estado === 'error') {
        return <EstadoError mensaje="No pudimos cargar este Pokémon" onReintentar={reintentar}/>;
    }
    if(!pokemon) {
        // La API respondió 404 (o el id de la URL no es un número): no es un fallo, es "no existe".
        return (
            <div className="py-12 text-center">
                <h1 className="text-2xl font-bold">Pokémon no encontrado</h1>
                <p className="mt-2 text-slate-600">No hay ningún Pokémon con el número «{id}».</p>
                <Link to="/" className="mt-3 inline-block underline">Volver al Pokédex</Link>
            </div>
        );
    }

    return (
        <>
            <Link to="/" className="text-sm underline">← Volver al Pokédex</Link>
            <article className="flex flex-wrap gap-8 py-4">
                <img src={pokemon.imagen} alt={capitalizar(pokemon.nombre)} width={256} height={256}
                    className="aspect-square w-64 max-w-full rounded-xl bg-slate-100 object-contain p-4"/>
                <div className="min-w-0 flex-1 basis-72">
                    <p className="text-sm text-slate-500">{formatearNumero(pokemon.id)}</p>
                    <h1 className="text-3xl font-bold">{capitalizar(pokemon.nombre)}</h1>
                    <ul className="mt-2 flex flex-wrap gap-2" aria-label="Tipos">
                        {pokemon.tipos.map((tipo) => <li key={tipo}><EtiquetaTipo tipo={tipo}/></li>)}
                    </ul>
                    <p className="mt-4 text-sm text-slate-600">
                        Altura: {formatearDecimal(pokemon.alturaM)} m · Peso: {formatearDecimal(pokemon.pesoKg)} kg
                    </p>
                    <p className="text-sm capitalize text-slate-600">Habilidades: {pokemon.habilidades.join(', ')}</p>
                    <h2 className="mt-5 font-semibold">Estadísticas base</h2>
                    <dl className="mt-2 flex flex-col gap-2">
                        {pokemon.estadisticas.map((e) => <BarraEstadistica key={e.nombre} estadistica={e}/>)}
                    </dl>
                </div>
            </article>
            <nav className="mt-2 flex justify-between text-sm" aria-label="Navegar entre Pokémon">
                {pokemon.id > 1
                    ? <Link to={`/pokemon/${pokemon.id - 1}`} className="underline">← {formatearNumero(pokemon.id - 1)}</Link>
                    : <span/>}
                {pokemon.id < TOTAL_ESPECIES
                    ? <Link to={`/pokemon/${pokemon.id + 1}`} className="underline">{formatearNumero(pokemon.id + 1)} →</Link>
                    : <span/>}
            </nav>
        </>
    );
}
