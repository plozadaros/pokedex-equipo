import { Link, NavLink } from "react-router-dom";
import { useSesion } from "../../aplicacion/useSesion";
import { NOMBRE_APP } from "../marca";

const claseEnlace = ({isActive} : {isActive : boolean}) =>
    isActive ? 'font-bold underline underline-offset-4' : 'hover:underline underline-offset-4';

export default function Header () {
    const { usuario, salir } = useSesion();
    return (
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
                <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
                    <span aria-hidden="true"
                        className="inline-block h-6 w-6 rounded-full border-2 border-slate-900 bg-linear-to-b from-red-500 from-50% to-white to-50%"/>
                    {NOMBRE_APP}
                </Link>
                <nav className="mt-2 flex gap-4 text-sm" aria-label="Principal">
                    <NavLink to="/" end className={claseEnlace}>Pokédex</NavLink>
                    {/* Las secciones del usuario solo se ofrecen con sesión: las rutas además están protegidas en App */}
                    {usuario && <NavLink to="/equipo" className={claseEnlace}>Mi equipo</NavLink>}
                    {usuario && <NavLink to="/perfil" className={claseEnlace}>Mi perfil</NavLink>}
                </nav>
            </div>
            {usuario ? (
                <p className="text-sm">
                    Hola, {usuario.nombre}
                    <button className="ml-2 underline" onClick={salir}>Cerrar sesión</button>
                </p>
            ) : (
                <Link to="/login" className="text-sm underline">Iniciar sesión</Link>
            )}
        </header>
    );
}
