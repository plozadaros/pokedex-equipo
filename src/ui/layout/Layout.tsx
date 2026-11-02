import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

// El marco de toda página se escribe UNA vez: Header, el hueco <Outlet/> donde va la página que
// toque según la URL, y Footer. El Suspense atrapa las páginas lazy mientras baja su archivo.
export default function Layout () {
    return (
        <div className="mx-auto flex min-h-screen max-w-5xl flex-col p-4 sm:p-6">
            <Header/>
            <main className="flex-1">
                <Suspense fallback={<p className="py-6 text-slate-500" role="status">Cargando la página...</p>}>
                    <Outlet/>
                </Suspense>
            </main>
            <Footer/>
        </div>
    );
}
