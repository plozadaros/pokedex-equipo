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

// El detalle completo: se pide solo cuando se abre /pokemon/:id. `imagen` es el sprite pequeño
// (el mismo del listado y del equipo) y `arte` la ilustración grande para la página de detalle.
export interface Pokemon extends ResumenPokemon {
    arte : string;
    tipos : string[];
    alturaM : number;
    pesoKg : number;
    habilidades : string[];
    estadisticas : Estadistica[];
}

// La colección del usuario: su equipo de Pokémon. Guarda lo mínimo para dibujarlo sin pedir nada.
export type Equipo = ResumenPokemon[];

export type EstadoCarga ='cargando' | 'listo' | 'error';

export interface Usuario {
    id : number;
    nombre : string;
    email : string;
    token : string;
    expiraEn : number;
}
