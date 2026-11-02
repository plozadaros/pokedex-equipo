// Silueta de la página de detalle: la imagen grande a la izquierda y, a la derecha, número, nombre,
// tipos, medidas y barras de estadísticas. Sirve de fallback del Suspense de la ruta (mientras baja
// el archivo de la página) y de estado "cargando" mientras llega el Pokémon.
export default function SkeletonDetalle () {
    return (
        <div className="flex animate-pulse flex-wrap gap-8 py-6 motion-reduce:animate-none" role="status">
            <span className="sr-only">Cargando el Pokémon...</span>
            <div className="aspect-square w-64 max-w-full rounded-xl bg-slate-200" aria-hidden="true"/>
            <div className="w-80 max-w-full" aria-hidden="true">
                <div className="mb-2 h-3 w-1/5 rounded bg-slate-200"/>
                <div className="mb-3 h-8 w-2/3 rounded bg-slate-200"/>
                <div className="mb-4 flex gap-2">
                    <div className="h-6 w-16 rounded-full bg-slate-200"/>
                    <div className="h-6 w-16 rounded-full bg-slate-200"/>
                </div>
                <div className="mb-4 h-4 w-3/4 rounded bg-slate-200"/>
                {Array.from({length : 6}).map((_, indice) => (
                    <div key={indice} className="mb-2 h-4 w-full rounded bg-slate-200"/>
                ))}
            </div>
        </div>
    );
}
