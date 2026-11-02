# Pokédex Equipo

**URL pública (Vercel):** https://pokedex-equipo.vercel.app/

Un Pokédex para armar tu equipo de seis. Proyecto final del bloque React del Bootcamp Frontend & React
(Tecsup): React 19 + TypeScript + Vite + Tailwind 4, con `react-router-dom`, Context, hooks propios, sesión
con JWT y arquitectura en capas.

- **Entidad principal:** Pokémon, desde [PokeAPI](https://pokeapi.co) (API real, gratuita, sin clave).
- **Colección del usuario:** «Mi equipo» (máximo 6, sin repetidos), guardada por usuario.
- **Formulario principal:** «Ficha de entrenador» (nombre, correo, región, edad y lema) con validación por campo.
- **Sesión:** login con JWT de [DummyJSON](https://dummyjson.com/docs/auth); las rutas `/equipo` y `/perfil` son privadas.

## Cómo correrlo

```bash
cp .env.example .env     # y ajusta los valores (el .env no se sube a GitHub)
npm install
npm run dev              # servidor de desarrollo
npm run build            # tsc -b && vite build: debe terminar sin errores
npm run lint             # oxlint
npm run probar           # comprueba las reglas puras del dominio (Node 22.18 o superior)
```

**Usuario de prueba:** el que publica la documentación de DummyJSON (`emilys` / `emilyspass`). Esa API no
guarda altas nuevas, por eso la aplicación no tiene pantalla de registro: solo login.

## Variables de entorno

Vite solo deja pasar al navegador las que empiezan con `VITE_` (se leen con `import.meta.env`, siempre desde
`src/infraestructura/config.ts`). En producción se configuran en Vercel (Settings > Environment Variables) y se
redespliega, porque se leen al construir, no en vivo. Si faltan, se usan las direcciones públicas por defecto.

| Variable            | Para qué sirve                                  | Por defecto                  |
| ------------------- | ----------------------------------------------- | ---------------------------- |
| `VITE_POKEAPI_URL`  | API de Pokémon (lista y detalle), sin clave     | `https://pokeapi.co/api/v2`  |
| `VITE_AUTH_URL`     | API de sesión (login con JWT y `/auth/me`)      | `https://dummyjson.com`      |

## Despliegue en Vercel

1. Importar este repositorio en Vercel (Framework Preset: **Vite**; el proyecto está en la raíz, no hace falta Root Directory).
2. Opcional: definir `VITE_POKEAPI_URL` y `VITE_AUTH_URL` (sin ellas se usan las de por defecto).
3. `vercel.json` ya trae el _rewrite_ de SPA (`/(.*)` → `/index.html`): sin él, recargar `/pokemon/25` daría 404.

## Rutas

| Ruta            | Página                                          | Acceso          |
| --------------- | ----------------------------------------------- | --------------- |
| `/`             | Pokédex: búsqueda y paginación en la URL        | Pública         |
| `/pokemon/:id`  | Detalle (tipos, medidas, estadísticas)          | Pública         |
| `/login`        | Inicio de sesión con «Recordarme»               | Pública         |
| `/equipo`       | Mi equipo (la colección del usuario)            | Requiere sesión |
| `/perfil`       | Ficha de entrenador (el formulario principal)   | Requiere sesión |
| `*`             | 404 propia                                      | Pública         |

## Contrato (`src/dominio/tipos.ts`)

```ts
export interface ResumenPokemon { id: number; nombre: string; imagen: string }
export interface Pokemon extends ResumenPokemon {
    arte: string; tipos: string[]; alturaM: number; pesoKg: number;
    habilidades: string[]; estadisticas: { nombre: string; valor: number }[];
}
export type Equipo = ResumenPokemon[];
```

Los nombres de PokeAPI (`name`, `stats`, `base_stat`, `official-artwork`…) solo existen en `infraestructura/pokeapi.ts`.

## Arquitectura

Las flechas apuntan hacia adentro: las capas de afuera importan del dominio, nunca al revés.

```
src/
  dominio/          reglas puras: funciones que reciben datos y devuelven datos. No importa de nadie.
  infraestructura/  conecta con la red y el disco. Importa del dominio.
  aplicacion/       casos de uso con React: conectan dominio e infraestructura con la UI.
  ui/               lo que se ve. Importa de todos; nunca toca el disco ni la red directo.
```

| Carpeta            | Propósito | Ejemplo |
| ------------------ | --------- | ------- |
| `dominio/`         | Las reglas del negocio, sin React, red ni disco, y por eso fáciles de probar con `npm run probar`. | `equipo.ts`: `agregarMiembro` rechaza el séptimo Pokémon y los repetidos; `entrenador.ts`: `validarFicha`. |
| `infraestructura/` | Todo lo que sale del programa: red (PokeAPI, DummyJSON) y disco (`localStorage`). Traduce a nuestro contrato y pasa lo leído por una «aduana». | `pokeapi.ts` (el adaptador), `auth.ts`, `almacen.ts` (`leerEquipo` descarta basura y repetidos). |
| `aplicacion/`      | Estado global y casos de uso: Context, hooks propios y el reductor. | `EquipoProvider` + `useEquipo`, `SesionProvider` + `useSesion`, `useRecurso` (tres estados + reintentar). |
| `ui/`              | Páginas, piezas y marco. Consume los hooks. | `pages/Home.tsx`, `components/TarjetaPokemon.tsx` (con `memo`), `layout/Layout.tsx`. |

**Puertos y adaptadores:** `dominio/repositorio.ts` define la interfaz `RepositorioPokemon`; `pokeapi.ts` y
`repositorioEnMemoria.ts` la implementan; `aplicacion/repositorio.ts` es el único archivo que elige una. Los hooks
dependen de la interfaz, no de PokeAPI.

## Decisión de diseño

> _Borrador para la sustentación: léelo, cámbialo con tus palabras y asegúrate de poder defender cada razón._

**La colección vive en Context con `useReducer`, y la regla del máximo vive en el dominio.**

- **Por qué Context:** el equipo lo usan a la vez el Header (contador), las tarjetas y el detalle (botón
  añadir/quitar), y la página `/equipo`. Sin Context habría que pasarlo por props a través de `Layout`, que no lo
  usa: _prop drilling_. Es estado de **toda** la aplicación, que es la regla para usar Context; el estado local
  (buscador, página) se queda en la URL y en su página.
- **Por qué `useReducer` y no `useState`:** cada acción («alternar», «quitar») recibe siempre el estado más reciente,
  así dos clics seguidos parten del resultado del anterior y no de la foto del render.
- **Por qué la regla «máximo 6, sin repetidos» está en `dominio/equipo.ts`:** es una regla de negocio, no de pantalla.
  Al ser una función pura se prueba sin navegador (`npm run probar`) y la UI solo la consulta. El botón deshabilitado
  de la tarjeta y el reductor usan la misma regla (`estaLleno` / `motivoRechazo`), así que no pueden contradecirse.
- **Por qué `key` por usuario:** `EquipoProvider` se remonta al cambiar de cuenta, y así cada usuario recupera su
  equipo del disco sin un efecto que sincronice a mano.
- **Por qué la búsqueda y la página están en la URL (`?q=pika&p=2`):** el enlace se puede compartir, F5 no lo pierde y
  el botón atrás vuelve a la búsqueda anterior. Es «estado mínimo»: todo lo demás se deriva.
- **Por qué PokeAPI y un índice en memoria:** la lista solo trae nombre y número, así que se pide **una vez** (~70 KB) y
  la búsqueda y la paginación ocurren en el cliente; las imágenes del listado se deducen del número, sin una petición
  por Pokémon. El detalle sí se pide por URL y distingue «no existe» (404, no es un error) de «falló la red».
- **Offline:** sin conexión el usuario ve el estado de error con «Reintentar», no un catálogo falso. Es lo correcto: es
  lo que realmente pasa, y la acción para salir de ahí está a un clic.

## Dónde está cada tema de la rúbrica

| # | Tema | Dónde |
| - | ---- | ----- |
| 1 | Vite + JSX | `index.html`, `src/main.tsx` |
| 2 | Componentes + props | `ui/components/` (uno por archivo, props tipadas con interfaces del dominio) |
| 3 | Listas y condicionales | `Home.tsx` (`key = id`, tres estados, vacío), `Equipo.tsx` |
| 4 | Eventos + useState | `Login.tsx`, `FormularioFicha.tsx`, `BotonEquipo.tsx` |
| 5 | useEffect | `useRecurso.ts` (fetch con limpieza), `SesionProvider.tsx` (validar y expirar), `EquipoProvider.tsx` (persistir), `useTitulo.ts` |
| 6 | API + carga + errores | `pokeapi.ts`, `useRecurso.ts`, `EstadoError.tsx`, `Skeleton*.tsx` (`AbortController`, sin `catch` vacío) |
| 7 | React Router | `App.tsx`, `Layout.tsx`, `RutaProtegida.tsx`, `Detalle.tsx` (`useParams`), 404 propia |
| 8 | Formularios | `useFormulario.ts`, `CampoForm.tsx`, `FormularioFicha.tsx`, `dominio/entrenador.ts` |
| 9 | Hooks + Context | `EquipoProvider` + `useEquipo`, `SesionProvider` + `useSesion`, `useFicha`, `useFormulario` |
| 10 | JWT + sesión + `.env` | `auth.ts` (`Authorization: Bearer`), `SesionProvider.tsx` (expira), `almacen.ts`, `config.ts` |
| 11 | Optimización | `memo` en `TarjetaPokemon`, `useMemo` en `Home.tsx` y los Provider, `lazy` + `Suspense` en `App.tsx` |
| 12 | Vercel | `vercel.json` (rewrite de SPA), sección «Despliegue» |
| + | Bonus: puertos y adaptadores | `dominio/repositorio.ts`, `infraestructura/pokeapi.ts`, `aplicacion/repositorio.ts` |
