import { memo } from "react";
import { Link } from "react-router-dom";
import type { ResumenPokemon } from "../../dominio/tipos";
import { capitalizar, formatearNumero } from "../formato";
import BotonEquipo from "./BotonEquipo";

interface Props {
    pokemon : ResumenPokemon;
    enEquipo : boolean;
    bloqueado : boolean;
    sesionIniciada : boolean;
    onAlternar : (pokemon : ResumenPokemon) => void;
}

// memo: con 24 tarjetas en pantalla, escribir en el buscador o añadir un Pokémon repinta la página;
// memo salta el re-render de las tarjetas cuyas props son las mismas de antes. Por eso Home le pasa
// valores simples (booleanos) y una función ESTABLE (alternar viene de useCallback): si fuera una
// función nueva en cada render, memo nunca saltaría nada.
function TarjetaPokemon ({ pokemon, enEquipo, bloqueado, sesionIniciada, onAlternar } : Props) {
    return (
        <article className="flex flex-col items-center rounded-xl border border-slate-200 p-3 text-center transition hover:shadow-md">
            <Link to={`/pokemon/${pokemon.id}`} className="block">
                <img src={pokemon.imagen} alt={`Sprite de ${capitalizar(pokemon.nombre)}`} width={96} height={96}
                    loading="lazy" className="mx-auto h-24 w-24 [image-rendering:pixelated]"/>
                <p className="mt-2 text-xs text-slate-500">{formatearNumero(pokemon.id)}</p>
                <h2 className="font-semibold">{capitalizar(pokemon.nombre)}</h2>
            </Link>
            <BotonEquipo enEquipo={enEquipo} bloqueado={bloqueado} sesionIniciada={sesionIniciada}
                onAlternar={() => onAlternar(pokemon)} clase="mt-3"/>
        </article>
    );
}

export default memo(TarjetaPokemon);
