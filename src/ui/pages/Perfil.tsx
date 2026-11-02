import { aValores, type ValoresFicha } from "../../dominio/entrenador";
import { useEquipo } from "../../aplicacion/useEquipo";
import { useFicha } from "../../aplicacion/useFicha";
import { useSesion } from "../../aplicacion/useSesion";
import FormularioFicha from "../components/FormularioFicha";
import TarjetaEntrenador from "../components/TarjetaEntrenador";
import { formatearHora } from "../formato";
import { NOMBRE_APP } from "../marca";
import { useTitulo } from "../useTitulo";

// Página protegida: solo se llega con sesión (RutaProtegida en App). Compone piezas pequeñas:
// el resumen de la cuenta, el formulario y la tarjeta con lo guardado.
export default function Perfil () {
    const { usuario } = useSesion();
    // RutaProtegida garantiza el usuario; este chequeo es para el tipo (usuario puede ser null) y no se ve.
    if(!usuario) return null;
    return <PerfilDe usuarioId={usuario.id} nombre={usuario.nombre} email={usuario.email} expiraEn={usuario.expiraEn}/>;
}

interface PropsPerfil {
    usuarioId : number;
    nombre : string;
    email : string;
    expiraEn : number;
}

function PerfilDe ({ usuarioId, nombre, email, expiraEn } : PropsPerfil) {
    const { ficha, guardar } = useFicha(usuarioId);
    const { cantidad } = useEquipo();
    useTitulo(`Mi perfil - ${NOMBRE_APP}`);

    // Si ya hay ficha, el formulario arranca con ella; si no, con los datos de la cuenta.
    const inicial : ValoresFicha = ficha ? aValores(ficha) : {nombre, email, region : '', edad : '', lema : ''};

    return (
        <section>
            <h1 className="text-3xl font-bold">Mi perfil</h1>
            <p className="mt-1 text-sm text-slate-600">
                Sesión iniciada como {nombre} (se cierra sola a las {formatearHora(expiraEn)}).
            </p>

            <div className="mt-6 grid gap-8 md:grid-cols-2">
                <div>
                    <h2 className="mb-3 text-xl font-semibold">Ficha de entrenador</h2>
                    <FormularioFicha inicial={inicial} onGuardar={guardar}/>
                </div>
                <div>
                    <h2 className="mb-3 text-xl font-semibold">Tu tarjeta</h2>
                    {ficha ? (
                        <TarjetaEntrenador ficha={ficha} pokemonEnEquipo={cantidad}/>
                    ) : (
                        <p className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
                            Aún no guardas tu ficha. Completa el formulario y aquí aparecerá tu tarjeta.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
