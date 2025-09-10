# AgroTech – Frontend (Vite + React + TypeScript)

Proyecto web creado **desde cero** para la plataforma agrícola AgroTech. Este repo contiene el **frontend** (React + Vite + TS) con UI en HeroUI/Tailwind y enrutamiento protegido.

## Colaboradores
- Kevin Alexis
- Darío

## Stack
- React 19 + Vite 7 + TypeScript 5
- TailwindCSS 4 (plugin `@tailwindcss/vite`) + HeroUI
- React Router DOM 7
- Axios
- Lucide-react (iconos)
- ESLint 9

## Requisitos
- Node.js 18+ (recomendado 20+)
- Backend expuesto vía REST (ver endpoints usados abajo)

## Configuración de entorno
Crear `.env` (ya presente) y ajustar:
```
VITE_API_URL=http://localhost:4000/api/v1   # URL base del backend
VITE_APP_NAME=AgroTech                      # Nombre de la app (opcional)
VITE_BYPASS_AUTH=true                       # true para omitir login en desarrollo
# VITE_ADMIN_TOKEN=...                      # opcional: token admin para /usuarios (alta de usuarios)
```

## Scripts
```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run preview
npm run lint
```

## Rutas de la app
- **Públicas**: `/start`, `/login`, `/register`, `/recover`, `/code`, `/recovery`
- **Privadas** (con layout protegido): `/home`, `/cultivos`, `/historial-cultivo`, `/registrar-cultivo`, `/actividades`

**Guards** (`src/routes/guards.tsx`):
- `ProtectedRoute` — exige token para acceder a privadas.
- `PublicOnlyRoute` — redirige a `/home` si ya hay token.
- `RequireRecoveryEmail` — exige `recoveryEmail` (flujo recuperación).
- `RequireRecoveryCode` — exige `recoveryEmail` + `recoveryCode`.

## UI y estilos
- **Tailwind v4** sin `tailwind.config.js`; la configuración vive en `src/index.css`:
  - `@import "tailwindcss";`
  - `@plugin "./hero.ts";` ← integra HeroUI
  - `@source "../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"`
- Tema HeroUI registrado en `src/hero.ts`.
- Proveedor de UI en `main.tsx` (`<HeroUIProvider>`).

## Estructura principal
```
src/
├─ App.tsx
├─ main.tsx
├─ index.css
├─ hero.ts
├─ layouts/
│  ├─ AppLayout.tsx
│  └─ ProtectedLayout.tsx
├─ routes/
│  └─ guards.tsx
├─ pages/
│  ├─ start.tsx
│  ├─ auth_page/
│  │  ├─ login.tsx
│  │  ├─ register.tsx
│  │  ├─ recover.tsx
│  │  ├─ code.tsx
│  │  └─ ChangePassword.tsx
│  └─ page_private/
│     ├─ home.tsx
│     ├─ actividad/actividades.tsx
│     └─ cultivo/
│        ├─ cultivos.tsx
│        ├─ registrarCultivo.tsx
│        └─ historialCultivo.tsx
├─ components/
│  └─ menu.tsx
├─ services/
│  ├─ api.ts
│  ├─ auth.ts
│  ├─ users.ts
│  ├─ cultivo.ts
│  └─ actividad.ts
└─ types/
   └─ auth.ts
```

## Servicios y endpoints usados
- Autenticación (`src/services/auth.ts`)
  - `POST /auth/login`
  - `POST /usuarios/solicitar-recuperacion`
  - `POST /usuarios/verificar-codigo`
  - `POST /usuarios/cambiar-contrasena`
- Usuarios (`src/services/users.ts`)
  - `POST /usuarios` (requiere token; admite `VITE_ADMIN_TOKEN` en desarrollo)
- Cultivos (`src/services/cultivo.ts`)
  - `GET /cultivos`
  - `POST /cultivos`
  - `GET/PUT/DELETE /cultivos/:id` (expuestos en funciones utilitarias)
- Actividades (`src/services/actividad.ts`)
  - `GET /actividades`
  - `POST /actividades`

**Interceptor Axios** (`src/services/api.ts`):
- Añade `Authorization: Bearer <token>` si existe en `localStorage`.
- En `401` limpia token y redirige a `/login`.

## Flujo de autenticación implementado
- **Login**: usa `loginService` (`/auth/login`). `VITE_BYPASS_AUTH=true` permite omitir en dev.
- **Recuperación**: `recover → code → recovery` con persistencia en `localStorage` (`recoveryEmail`, `recoveryCode`) y guards para navegación.
- **Register**: formulario con alta de usuario (rol por defecto invitado; estado activo).

## Estado actual
- Layout protegido con sidebar y submenú contextual para **Cultivos**.
- Dashboard inicial en `Home`.
- Formularios y vistas para **Cultivos** y **Actividades**.
- Assets en `public/` (imágenes de portada y logotipos).

## Notas
- Servidor de desarrollo: puerto `3000` (configurado en `vite.config.ts`).
- Alias de importación: `@` → `/src`.
- ESLint habilitado con reglas para React/TS.
