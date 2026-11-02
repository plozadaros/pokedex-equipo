import { Link } from "react-router-dom";
import { NOMBRE_APP } from "../marca";
import { useTitulo } from "../useTitulo";

export default function NoEncontrada () {
    useTitulo(`404 - ${NOMBRE_APP}`);
    return (
        <div className="py-16 text-center">
            <h1 className="text-5xl font-bold">404</h1>
            <p className="mt-2 text-slate-600">Esta página no existe en el Pokédex.</p>
            <Link to="/" className="mt-3 inline-block underline">Volver al Pokédex</Link>
        </div>
    );
}
