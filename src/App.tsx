import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./ui/layout/Layout";
import Home from "./ui/pages/Home";
import NoEncontrada from "./ui/pages/NoEncontrada";
import RutaProtegida from "./ui/components/RutaProtegida";
import SkeletonDetalle from "./ui/components/SkeletonDetalle";

// App es SOLO el mapa de rutas: qué dirección muestra qué página. Nada de fetch ni de estado aquí;
// cada pantalla vive en ui/pages y pide lo que necesita con sus propios hooks.
//
// lazy: las páginas que no todos visitan bajan en su propio archivo la primera vez que se entra.
// Home NO se parte: es la que todos ven y partirla sería descargar de más.
const Detalle = lazy(() => import("./ui/pages/Detalle"));
const Login = lazy(() => import("./ui/pages/Login"));
const Equipo = lazy(() => import("./ui/pages/Equipo"));
const Perfil = lazy(() => import("./ui/pages/Perfil"));

// Mapa de rutas:  /  ·  /pokemon/:id  ·  /equipo y /perfil (protegidas)  ·  /login  ·  *
export default function App () {
    return (
        <Routes>
            <Route element={<Layout/>}>
                <Route path="/" element={<Home/>}/>
                {/* Suspense propio de Detalle: mientras baja su archivo se ve su silueta, no un mensaje genérico.
                    Gana el Suspense MÁS CERCANO hacia arriba; el de Layout cubre el resto de páginas lazy. */}
                <Route path="/pokemon/:id" element={
                    <Suspense fallback={<SkeletonDetalle/>}>
                        <Detalle/>
                    </Suspense>
                }/>
                {/* Todo lo que está dentro de esta ruta padre (sin path) exige sesión. */}
                <Route element={<RutaProtegida/>}>
                    <Route path="/equipo" element={<Equipo/>}/>
                    <Route path="/perfil" element={<Perfil/>}/>
                </Route>
                <Route path="/login" element={<Login/>}/>
                <Route path="*" element={<NoEncontrada/>}/>
            </Route>
        </Routes>
    );
}
