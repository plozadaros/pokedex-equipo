import { memo } from "react";
import { Link } from "react-router-dom";
import type { ResumenPokemon } from "../../dominio/tipos";
import { capitalizar, formatearNumero } from "../formato";

interface Props {
    pokemon : ResumenPokemon;
}

// memo: con 24 tarjetas en pantalla, escribir en el buscador repinta la página; memo salta el
// re-render de las tarjetas cuya prop `pokemon` es el mismo objeto de antes.
function TarjetaPokemon ({ pokemon } : Props) {
    return (
        <article className="rounded-xl border border-slate-200 p-3 text-center transition hover:shadow-md">
            <Link to={`/pokemon/${pokemon.id}`} className="block">
                <img src={pokemon.imagen} alt={`Sprite de ${capitalizar(pokemon.nombre)}`} width={96} height={96}
                    loading="lazy" className="mx-auto h-24 w-24 [image-rendering:pixelated]"/>
                <p className="mt-2 text-xs text-slate-500">{formatearNumero(pokemon.id)}</p>
                <h2 className="font-semibold">{capitalizar(pokemon.nombre)}</h2>
            </Link>
        </article>
    );
}

export default memo(TarjetaPokemon);
