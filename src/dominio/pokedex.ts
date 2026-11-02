import type { ResumenPokemon } from "./tipos";

// Reglas puras del Pokédex: reciben datos y devuelven datos. Ni React, ni red, ni disco.

// Las especies numeradas del Pokédex nacional (la API además trae formas alternativas con
// ids muy altos que no mostramos).
export const TOTAL_ESPECIES = 1025;
export const POR_PAGINA = 24;

// Busca por nombre (contiene el texto) o por número exacto de Pokédex ("25" encuentra a Pikachu).
export function filtrarPorTermino (indice : ResumenPokemon[], termino : string) : ResumenPokemon[] {
    const texto = termino.trim().toLowerCase();
    if(texto === '') return indice;
    const numero = /^\d+$/.test(texto) ? Number(texto) : null;
    return indice.filter((p) => p.nombre.includes(texto) || p.id === numero);
}

export function totalPaginas (cantidad : number, porPagina = POR_PAGINA) : number {
    return Math.max(1, Math.ceil(cantidad / porPagina));
}

export function paginar<T> (items : T[], pagina : number, porPagina = POR_PAGINA) : T[] {
    const inicio = (pagina - 1) * porPagina;
    return items.slice(inicio, inicio + porPagina);
}

// Las estadísticas base de la serie principal llegan hasta 255 (Blissey tiene 255 de PS).
export const ESTADISTICA_MAXIMA = 255;
