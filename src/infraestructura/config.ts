// Direcciones de las dos APIs, leídas de las variables de entorno (.env en local, panel de Vercel
// en producción). Vite solo deja pasar al navegador las que empiezan con VITE_. Se leen AQUÍ, en
// infraestructura: el dominio no sabe que existe un .env. Si faltan, se usa la dirección pública
// de cada servicio, así que la aplicación nunca queda apuntando a "undefined/pokemon".
export const POKEAPI_URL : string = import.meta.env.VITE_POKEAPI_URL?.trim() || 'https://pokeapi.co/api/v2';
export const AUTH_URL : string = import.meta.env.VITE_AUTH_URL?.trim() || 'https://dummyjson.com';
