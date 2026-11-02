// El CONTRATO de la aplicación: lo único que el resto del código sabe de un Pokémon, de la sesión
// y de las pantallas. Todo en español y sin nombres de la API: la forma cruda (name, stats,
// base_stat...) solo existe en infraestructura/pokeapi.ts, que la traduce a estas interfaces.

// Lo que se sabe de un Pokémon en el listado (sin pedir su detalle).
export interface ResumenPokemon {
    id : number;
    nombre : string;
    imagen : string;
}

export interface Estadistica {
    nombre : string;
    valor : number;
}

// El detalle completo: se pide solo cuando se abre /pokemon/:id.
export interface Pokemon extends ResumenPokemon {
    tipos : string[];
    alturaM : number;
    pesoKg : number;
    habilidades : string[];
    estadisticas : Estadistica[];
}

export type EstadoCarga = 'cargando' | 'listo' | 'error';

export interface Usuario {
    id : number;
    nombre : string;
    email : string;
    token : string;
    expiraEn : number;
}
