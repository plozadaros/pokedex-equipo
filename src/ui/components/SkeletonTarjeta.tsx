// Silueta de TarjetaPokemon: un bloque gris por cada bloque de la tarjeta real, en el mismo orden
// y con tamaños parecidos (imagen, número, nombre y botón), para que al llegar los datos la página
// no "salte". motion-reduce:animate-none respeta a quien pidió menos movimiento en su sistema.
export default function SkeletonTarjeta () {
    return (
        <div className="animate-pulse rounded-xl border border-slate-200 p-3 text-center motion-reduce:animate-none" aria-hidden="true">
            <div className="mx-auto h-24 w-24 rounded-full bg-slate-200"/>
            <div className="mx-auto mt-2 h-3 w-1/4 rounded bg-slate-200"/>
            <div className="mx-auto mt-2 h-5 w-2/3 rounded bg-slate-200"/>
            <div className="mx-auto mt-3 h-7 w-36 rounded-full bg-slate-200"/>
        </div>
    );
}
