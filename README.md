# Pokédex Equipo

**URL pública (Vercel):** _pendiente: pegar aquí la dirección `.vercel.app` cuando se despliegue_

Un Pokédex para armar tu equipo de seis. Proyecto final del bloque React del Bootcamp Frontend & React
(Tecsup): React 19 + TypeScript + Vite + Tailwind 4, con `react-router-dom`, Context, hooks propios,
sesión con JWT y arquitectura en capas.

## Cómo correrlo

```bash
cp .env.example .env     # y ajusta los valores (el .env no se sube a GitHub)
npm install
npm run dev              # servidor de desarrollo
npm run build            # tsc -b && vite build: debe terminar sin errores
npm run lint             # oxlint
```

## Variables de entorno

Vite solo deja pasar al navegador las que empiezan con `VITE_` (se leen con `import.meta.env`, siempre desde
`src/infraestructura/config.ts`). En producción se configuran en Vercel (Settings > Environment Variables) y se
redespliega, porque se leen al construir, no en vivo. Si faltan, se usan las direcciones públicas por defecto.

| Variable            | Para qué sirve                                  | Por defecto                  |
| ------------------- | ----------------------------------------------- | ---------------------------- |
| `VITE_POKEAPI_URL`  | API de Pokémon (lista y detalle), sin clave     | `https://pokeapi.co/api/v2`  |
| `VITE_AUTH_URL`     | API de sesión (login con JWT y `/auth/me`)      | `https://dummyjson.com`      |
