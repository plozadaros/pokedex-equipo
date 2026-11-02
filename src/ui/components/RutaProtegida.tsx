import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSesion } from "../../aplicacion/useSesion";

/*
  ¿Dónde se controla el acceso a /equipo y /perfil, y qué se hace con quien no entró?

  Dónde: en UNA ruta padre sin path (esta), que revisa la sesión y deja pasar con <Outlet/>.
  Toda ruta que se meta adentro en App.tsx queda protegida de una vez. Un `if (!usuario)` en cada
  página repetiría lo mismo N veces y el día que se agregue una página nueva alguien se olvidaría.

  Qué hacer con quien no entró: mandarlo a /login con <Navigate>. `replace` reemplaza la entrada
  del historial (si no, el botón atrás rebotaría entre /login y la página protegida) y
  `state.desde` lleva a dónde iba, sin ensuciar la URL, para que el login lo devuelva ahí.

  Límite: esto es comodidad, no seguridad. El navegador es del usuario y puede saltarse cualquier
  if. Lo que protege de verdad es que el SERVIDOR valide el token (por eso SesionProvider llama a
  /auth/me con Authorization: Bearer y no se fía solo de expiraEn).
*/
export default function RutaProtegida () {
    const { usuario } = useSesion();
    const ubicacion = useLocation();
    if(!usuario) {
        return <Navigate to="/login" replace state={{desde : ubicacion.pathname}}/>;
    }
    return <Outlet/>;
}
