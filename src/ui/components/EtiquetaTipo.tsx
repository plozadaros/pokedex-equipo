// Los colores son presentación: el dominio solo sabe que un Pokémon es de tipo "fuego".
// Las clases van completas (no armadas con texto) para que Tailwind las encuentre al construir.
const COLORES : Record<string, string> = {
    normal : 'bg-stone-200 text-stone-800',
    fuego : 'bg-orange-200 text-orange-900',
    agua : 'bg-sky-200 text-sky-900',
    'eléctrico' : 'bg-yellow-200 text-yellow-900',
    planta : 'bg-green-200 text-green-900',
    hielo : 'bg-cyan-200 text-cyan-900',
    lucha : 'bg-red-200 text-red-900',
    veneno : 'bg-purple-200 text-purple-900',
    tierra : 'bg-amber-200 text-amber-900',
    volador : 'bg-indigo-200 text-indigo-900',
    'psíquico' : 'bg-pink-200 text-pink-900',
    bicho : 'bg-lime-200 text-lime-900',
    roca : 'bg-yellow-100 text-stone-800',
    fantasma : 'bg-violet-200 text-violet-900',
    'dragón' : 'bg-blue-200 text-blue-900',
    siniestro : 'bg-zinc-300 text-zinc-900',
    acero : 'bg-slate-200 text-slate-800',
    hada : 'bg-rose-200 text-rose-900'
};

interface Props {
    tipo : string;
}

export default function EtiquetaTipo ({ tipo } : Props) {
    return (
        <span className={`rounded-full px-3 py-0.5 text-sm font-medium capitalize ${COLORES[tipo] ?? 'bg-slate-200 text-slate-800'}`}>
            {tipo}
        </span>
    );
}
