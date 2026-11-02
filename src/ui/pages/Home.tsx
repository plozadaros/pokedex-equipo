import { useMemo, type ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { useEquipo } from "../../aplicacion/useEquipo";
import { usePokedex } from "../../aplicacion/usePokedex";
import { useSesion } from "../../aplicacion/useSesion";
import { POR_PAGINA, filtrarPorTermino, paginar, totalPaginas } from "../../dominio/pokedex";
import type { ResumenPokemon } from "../../dominio/tipos";
import EstadoError from "../components/EstadoError";
import SkeletonTarjeta from "../components/SkeletonTarjeta";
import TarjetaPokemon from "../components/TarjetaPokemon";
import { pluralizar } from "../formato";
import { NOMBRE_APP } from "../marca";
import { useTitulo } from "../useTitulo";

// Un arreglo vacío ÚNICO: `datos ?? []` crearía uno nuevo en cada render y rompería el useMemo.
const SIN_DATOS : ResumenPokemon[] = [];

// El estado de la búsqueda y de la página vive en la URL (?q=pika&p=2), no en useState: el enlace
// se puede compartir, F5 no lo pierde y el botón atrás vuelve a la búsqueda anterior. Es "estado
// mínimo": la URL es la fuente y todo lo demás (filtrados, página visible) se DERIVA de ella.
function armarParametros (termino : string, pagina : number) : URLSearchParams {
    const parametros = new URLSearchParams();
    if(termino !== '') parametros.set('q', termino);
    if(pagina > 1) parametros.set('p', String(pagina));
    return parametros;
}

export default function Home () {
    const { estado, datos, reintentar } = usePokedex();
    const { usuario } = useSesion();
    const { equipo, lleno, alternar } = useEquipo();
    const [parametros, setParametros] = useSearchParams();
    // Los ids del equipo, para preguntar "¿está en el equipo?" por tarjeta sin recorrer el arreglo.
    const idsEquipo = useMemo(() => new Set(equipo.map((miembro) => miembro.id)), [equipo]);
    const termino = parametros.get('q') ?? '';

    const filtrados = useMemo(() => filtrarPorTermino(datos ?? SIN_DATOS, termino), [datos, termino]);
    const paginas = totalPaginas(filtrados.length);
    const pagina = Math.min(Math.max(Math.floor(Number(parametros.get('p'))) || 1, 1), paginas);
    const visibles = useMemo(() => paginar(filtrados, pagina), [filtrados, pagina]);

    const busqueda = termino.trim();
    useTitulo(
        estado !== 'listo' ? `Pokédex - ${NOMBRE_APP}`
        : busqueda !== '' ? `"${busqueda}" · ${pluralizar(filtrados.length, 'resultado', 'resultados')} - ${NOMBRE_APP}`
        : `Pokédex · página ${pagina} de ${paginas} - ${NOMBRE_APP}`
    );

    function cambiarTermino (e : ChangeEvent<HTMLInputElement>) {
        // replace: escribir no llena el historial con una entrada por letra
        setParametros(armarParametros(e.target.value, 1), {replace : true});
    }
    function irAPagina (destino : number) {
        setParametros(armarParametros(termino, destino));
        window.scrollTo({top : 0});
    }

    return (
        <>
            <h1 className="text-3xl font-bold">Pokédex</h1>
            <p className="mt-1 text-slate-600">Busca por nombre o número, mira el detalle y arma tu equipo de seis.</p>

            <div className="my-5">
                <label htmlFor="buscar" className="sr-only">Buscar Pokémon por nombre o número</label>
                <input id="buscar" type="search" value={termino} onChange={cambiarTermino}
                    placeholder="Busca por nombre o número... (pikachu, 25)"
                    className="w-full max-w-md rounded-lg border border-slate-300 px-3 py-2"/>
            </div>

            {estado === 'cargando' && (
                <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" aria-label="Cargando Pokémon">
                    {Array.from({length : POR_PAGINA}).map((_, indice) => (
                        <li key={indice}><SkeletonTarjeta/></li>
                    ))}
                </ul>
            )}

            {estado === 'error' && (
                <EstadoError mensaje="No pudimos cargar el Pokédex" onReintentar={reintentar}/>
            )}

            {estado === 'listo' && (
                <>
                    <p className="mb-3 text-sm text-slate-500" aria-live="polite">{filtrados.length} Pokémon</p>
                    {filtrados.length === 0 ? (
                        <p className="rounded-xl border border-slate-200 p-6 text-slate-600">
                            No encontramos ningún Pokémon para «{busqueda}».{' '}
                            <button className="underline" onClick={() => setParametros({})}>Ver todos</button>
                        </p>
                    ) : (
                        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                            {visibles.map((pokemon) => {
                                const enEquipo = idsEquipo.has(pokemon.id);
                                return (
                                    <li key={pokemon.id}>
                                        <TarjetaPokemon pokemon={pokemon} enEquipo={enEquipo}
                                            bloqueado={lleno && !enEquipo} sesionIniciada={usuario !== null}
                                            onAlternar={alternar}/>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                    {paginas > 1 && (
                        <nav className="mt-6 flex items-center justify-center gap-4 text-sm" aria-label="Paginación">
                            <button className="rounded-full border border-slate-300 px-4 py-1 disabled:opacity-40"
                                disabled={pagina <= 1} onClick={() => irAPagina(pagina - 1)}>Anterior</button>
                            <span>Página {pagina} de {paginas}</span>
                            <button className="rounded-full border border-slate-300 px-4 py-1 disabled:opacity-40"
                                disabled={pagina >= paginas} onClick={() => irAPagina(pagina + 1)}>Siguiente</button>
                        </nav>
                    )}
                </>
            )}
        </>
    );
}
