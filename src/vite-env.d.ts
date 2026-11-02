interface ImportMetaEnv {
    // Opcionales: si faltan, infraestructura/config.ts usa la direccion publica de cada API.
    readonly VITE_POKEAPI_URL? : string;
    readonly VITE_AUTH_URL? : string;
}
