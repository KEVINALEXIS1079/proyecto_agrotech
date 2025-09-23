# AgroTech — Frontend (Web)

Este repo contiene el **frontend web** de AgroTech construido con **React + Vite + TypeScript**, **Tailwind v4**, **HeroUI**, **TanStack Query** y **Axios**.

> Rama objetivo: `dev_kevin`  
> Fecha: 2025-09-23

## 👥 Colaboradores
- **Kevin Alexis** (líder de módulo web)
- **Kevin Castañeda** (colaborador en estructura y pantallas)

> Si necesitas agregar más personas, edita esta lista.

---

## 🚀 Tecnologías
- **Vite** (React + TS)
- **Tailwind CSS v4** + `tailwindcss-animate`
- **HeroUI** (componentes)
- **TanStack Query** (cache y fetching)
- **Axios** (cliente HTTP con interceptores JWT)
- **Lucide React** (íconos)
- **ESLint** + `typescript-eslint`

## 📁 Estructura principal
```
src/
  app/
    layout/               # Layouts (AppLayout, ProtectedLayout)
    routes.tsx            # Definición de rutas (públicas y protegidas)
    guards.tsx            # Guardas de ruta (auth)
    layout/components/    # Header, Sidebar, notificaciones, etc.
  modules/
    auth/                 # Login, registro, recuperación, cambio de clave
    usuarios/             # Gestión de usuarios
    cultivo/              # Módulo de cultivos
    actividad/            # Actividades agrícolas
    inventario/           # Entradas/salidas e inventario
    iot/                  # Sensores / monitoreo
    fitosanitario/        # Control fitosanitario
    permisos/             # Roles y permisos
    reportes/             # Reportes básicos
    landing/              # Pantallas públicas
    (otros …)
  shared/
    api/                  # axios client, helpers, interceptores
    hooks/                # hooks reutilizables
    lib/                  # utilidades
    ui/                   # componentes UI compartidos
App.tsx / App.css         # Bootstrap del app
```

### 📌 Notas rápidas de código
- `shared/api/client.ts` crea `api` con `baseURL` desde **`import.meta.env.VITE_API_URL`** y añade **token Bearer** si existe en `localStorage`.
- Interceptor de respuesta redirige a `/login` en **401**.

## ⚙️ Variables de entorno
Crea un `.env` en la raíz del proyecto:

```bash
VITE_API_URL=http://localhost:4000/api/v1
```

> En producción, cambia la URL por la de tu backend (NestJS).

## 🧩 Scripts
```bash
pnpm install        # o npm i / yarn
pnpm dev            # levanta en http://localhost:5173
pnpm build          # build de producción (tsc + vite)
pnpm preview        # sirve el build
pnpm lint           # linting
```

## 🧭 Rutas y auth
- Rutas públicas: login/registro/recuperación.
- Rutas privadas: protegidas por `ProtectedLayout` + guardas (`guards.tsx`).  
- El token se guarda en `localStorage`. Si expira, se limpia y se redirige a `/login`.

## 📦 Módulos incluidos (resumen)
- **Auth**: login, registro, recuperar, cambiar clave.
- **Usuarios**: listado CRUD (pendiente de integrar endpoints reales si aplica).
- **Cultivo / Actividad / Inventario / IoT / Fitosanitario / Reportes / Permisos**: estructura base con **páginas CRUD** (`Crear/Editar/Lista`) y **capa API** (`api/*.ts`) + **model** (tipos, zod, mappers) y **widgets/ui** para componentes.

> Tip: usa **TanStack Query** en `features/` para queries/mutations y mantener cache consistente.

## 🧱 Convenciones
- **Alias**: `@/*` y `#/*` apuntan a `src/*` (ver `tsconfig.json`).
- **Carpetas por módulo**: `api`, `features`, `model`, `pages`, `ui`, `widgets`.
- **Nombrado**: PascalCase para componentes, camelCase para funciones/variables.
- **Estilos**: Utiliza Tailwind y componentes de HeroUI.

## 📲 Móvil (Flutter) — Estado de integración
Se agregó el **proyecto móvil en Flutter** como parte del repositorio (carpeta `mobile/` o submódulo, según tu estructura final).  
El objetivo es **compartir funcionalmente** los módulos clave (auth, listado de cultivos, actividades) y mantener **URLs/API** consistentes usando la misma `VITE_API_URL`/`BASE_URL` del backend.

> Asegúrate de documentar en `mobile/README.md` cómo correr el proyecto, paquetes usados (`just_audio`, `shared_preferences`, `go_router`/`riverpod`, etc.) y cómo se autenticará contra el mismo backend JWT.


- Conectar endpoints reales del backend (NestJS) para cada módulo.
- Añadir **roles/permisos** en guardas de ruta (no solo token).
- Estandarizar **toasts**/notificaciones y manejo de errores por módulo.
- Añadir pruebas ligeras (unit y de componentes críticos).
- Configurar **CI** (lint + build) en el repo.


