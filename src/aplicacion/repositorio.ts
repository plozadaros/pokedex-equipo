import type { RepositorioPokemon } from "../dominio/repositorio";
import { repositorioPokeApi } from "../infraestructura/pokeapi";

// LA RAÍZ DE COMPOSICIÓN: el único archivo de la aplicación que sabe qué implementación del puerto
// se usa. Los hooks importan `repositorio` de aquí y lo tratan como RepositorioPokemon: no saben
// si detrás hay PokeAPI, otra API o datos en memoria. Para cambiar de fuente se cambia ESTA línea
// (por ejemplo, por repositorioEnMemoria de infraestructura/repositorioEnMemoria.ts).
export const repositorio : RepositorioPokemon = repositorioPokeApi;
