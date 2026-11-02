import { Link } from "react-router-dom";
import { MAX_EQUIPO } from "../../dominio/equipo";

interface Props {
    enEquipo : boolean;
    bloqueado : boolean;
    sesionIniciada : boolean;
    onAlternar : () => void;
    clase? : string;
}

// El botón "Añadir al equipo / Quitar del equipo", compartido por la tarjeta y el detalle.
//  - Sin sesión no hay equipo: en vez de un botón muerto se ofrece el camino, un enlace al login.
//  - Con el equipo lleno, los Pokémon que NO están en él quedan deshabilitados y dicen por qué.
export default function BotonEquipo ({ enEquipo, bloqueado, sesionIniciada, onAlternar, clase = '' } : Props) {
    const base = `rounded-full border px-4 py-1 text-sm ${clase}`;
    if(!sesionIniciada) {
        return <Link to="/login" state={{desde : '/'}} className={`${base} inline-block border-slate-400 hover:bg-slate-100`}>
            Entra para añadir
        </Link>;
    }
    return (
        <button onClick={onAlternar} disabled={bloqueado} aria-pressed={enEquipo}
            title={bloqueado ? `Tu equipo ya tiene ${MAX_EQUIPO} Pokémon` : undefined}
            className={`${base} ${enEquipo ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-400 hover:bg-slate-100'} disabled:cursor-not-allowed disabled:opacity-40`}>
            {enEquipo ? 'Quitar del equipo' : bloqueado ? 'Equipo completo' : 'Añadir al equipo'}
        </button>
    );
}
