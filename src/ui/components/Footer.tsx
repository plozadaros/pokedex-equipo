import { NOMBRE_APP } from "../marca";

const ANIO = new Date().getFullYear();

export default function Footer () {
    return (
        <footer className="mt-10 border-t border-slate-200 pt-4 text-sm text-slate-500">
            © {ANIO} {NOMBRE_APP} · Datos de{' '}
            <a href="https://pokeapi.co" className="underline" target="_blank" rel="noreferrer">PokeAPI</a>
        </footer>
    );
}
