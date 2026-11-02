import { ESTADISTICA_MAXIMA } from "../../dominio/pokedex";
import type { Estadistica } from "../../dominio/tipos";

interface Props {
    estadistica : Estadistica;
}

export default function BarraEstadistica ({ estadistica } : Props) {
    // El ancho es un derivado del valor: no hay estado que sincronizar.
    const porcentaje = Math.min(100, Math.round((estadistica.valor / ESTADISTICA_MAXIMA) * 100));
    return (
        <div className="flex items-center gap-3 text-sm">
            <dt className="w-28 shrink-0 text-slate-600">{estadistica.nombre}</dt>
            <dd className="flex flex-1 items-center gap-2">
                <span className="w-8 text-right font-semibold tabular-nums">{estadistica.valor}</span>
                <span className="h-2 flex-1 rounded-full bg-slate-200" aria-hidden="true">
                    <span className="block h-2 rounded-full bg-slate-700" style={{width : `${porcentaje}%`}}/>
                </span>
            </dd>
        </div>
    );
}
