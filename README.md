# 🥱 M'aburro

**¿No sabes qué hacer?** M'aburro te muestra todas tus actividades de un vistazo, organizadas por dónde (casa o fuera) y cuánto tiempo te llevan.

## Qué es

Una webapp personal para esos momentos de "me aburro". Abres la app, ves tus actividades flotando en una cuadrícula visual, eliges una y listo. Cada vez que haces algo, queda registrado.

## Cómo funciona

- **Vista principal** — Tus actividades organizadas en columnas (Casa / Fuera) y filas (1h / 2h / >2h)
- **Obligaciones** — Un toggle para mostrar u ocultar las tareas obligatorias
- **Registro** — Click en una actividad y queda guardado qué hiciste y cuándo
- **Config** — Crea y edita los atributos que definen tus actividades

## Stack

- Vue 3 + Vite + Tailwind CSS v4
- Supabase (PostgreSQL)
- Vercel

## Setup

```bash
npm install
```

Copia `.env` y rellena con tus credenciales de Supabase:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Ejecuta el schema en Supabase SQL Editor:

```bash
# El archivo está en supabase/schema.sql
```

Arranca:

```bash
npm run dev
```

## Pensado para

Tablet en horizontal. También funciona en escritorio y en móvil apaisado.
