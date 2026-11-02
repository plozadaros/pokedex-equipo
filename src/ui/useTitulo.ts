import { useEffect } from "react";

// Pone el título de la pestaña. Tocar document.title es un efecto colateral (toca el mundo, no
// calcula): vive en un useEffect, no en el render. El título se arma en cada página como un
// DERIVADO de lo que ya sabe (nombre del Pokémon, cantidad de resultados) y el efecto lo publica
// solo cuando CAMBIA el texto: la única dependencia es el propio texto, así ninguna pieza del
// título queda "congelada" con un valor viejo.
export function useTitulo (titulo : string) {
    useEffect(() => {
        document.title = titulo;
    }, [titulo]);
}
