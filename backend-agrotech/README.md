
# 🌿 Agrotech Backend

Este repositorio contiene el backend de la aplicación **Agrotech**, desarrollado con **NestJS**, **TypeORM** y **PostgreSQL**.

---

## 📦 Estructura del Proyecto

```
backend_agrotech/
├── src/
│   ├── tipo-cultivo/
│   ├── cultivos/
│   ├── sublotes/
│   ├── lotes/
│   ├── migrations/
│   └── data-source.ts
├── docker-compose.yml
├── package.json
└── tsconfig.json
```

---

## ⚙️ Configuración de TypeORM

**Archivo principal de configuración:** `src/data-source.ts`

```ts
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'host.docker.internal',
  port: 5432,
  username: 'agrotech',
  password: '123',
  database: 'agrotech',
  synchronize: false,
  logging: false,
  entities: [TipoCultivo, Cultivo, Sublote, Lote],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: [],
});
```

> ⚠️ **IMPORTANTE:** Asegúrate de mantener `synchronize: false` si estás usando migraciones, para evitar que TypeORM modifique el esquema automáticamente.  
> Utiliza `autoLoadEntities: true` en el `AppModule` si no estás cargando las entidades manualmente en `data-source.ts`.

---

## 🔧 Scripts disponibles (`package.json`)

```json
"scripts": {
  "typeorm": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js -d src/data-source.ts",
  "migrations:generate": "npm run typeorm -- migration:generate -p",
  "migrations:run": "npm run typeorm -- migration:run",
  "migration:create": "npm run typeorm -- migration:create"
}
```

---

## 📜 Comandos útiles de migraciones

- 🔨 **Generar migración automática con nombre:**

```bash
npm run migrations:generate src/migrations/InitialMigration
```

- 📝 **Crear migración vacía:**

```bash
npm run migration:create -- src/migrations/NombreMigracion
```

- 🚀 **Ejecutar migraciones pendientes:**

```bash
npm run migrations:run
```

---

## 🐳 Docker - Servicios y configuración

### 🧾 docker-compose.yml

```yaml
version: '3.9'

services:
  postgres:
    image: postgres:13
    container_name: agrotech_database
    environment:
      POSTGRES_USER: agrotech
      POSTGRES_PASSWORD: 123
      POSTGRES_DB: agrotech
    ports:
      - "5432:5432"
    volumes:
      - pg_data:/var/lib/postgresql/data

  pgadmin:
    image: dpage/pgadmin4
    container_name: pgadmin4
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "8080:80"
    depends_on:
      - postgres

volumes:
  pg_data:
```

---

### 🐚 Comandos Docker útiles

- ✅ Levantar servicios:
```bash
docker compose up -d
```

- ❌ Detener servicios:
```bash
docker compose down
```

- 💣 Eliminar contenedores + volúmenes:
```bash
docker compose down -v
```

- 🔄 Reiniciar servicios:
```bash
docker compose restart
```

- 🧐 Ver contenedores activos:
```bash
docker ps
```

- 🐘 Ingresar a PostgreSQL dentro del contenedor:
```bash
docker exec -it agrotech_database psql -U agrotech -d agrotech
```

---

## 🌐 Acceder a pgAdmin

1. Abre tu navegador y entra a: [http://localhost:8080](http://localhost:8080)
2. Credenciales:
   - **Email:** `admin@admin.com`
   - **Contraseña:** `admin`
3. Crear nuevo servidor:
   - **Name:** `PostgresDocker`
   - **Host:** `postgres` (nombre del servicio)
   - **Port:** `5432`
   - **DB:** `agrotech`
   - **User:** `agrotech`
   - **Password:** `123`
4. Visualizar la base de datos en pgAdmin:
**AppModule.ts:** Coloca temporalmente `synchronize: true` en la configuración de `TypeOrmModule.forRoot()` para que TypeORM cree automáticamente las tablas según tus entidades.

Una vez cargadas las tablas en la base de datos, desactiva esta opción `synchronize: false` para evitar pérdida de datos o conflictos en producción.

---

## 🧯 Cambiar entre PostgreSQL Nativo y Docker

### 🔌 Desactivar PostgreSQL Nativo para usar Docker

#### 1. Detener el servicio de PostgreSQL nativo

- **Windows**
```bash
net stop postgresql-x64-13
```
*(Reemplaza `13` si tu versión es diferente)*

#### 2. Verifica que está detenido
```bash
ps aux | grep postgres
```

#### 3. Levantar servicios con Docker
```bash
docker compose up -d
```

---

### 🔁 Volver a usar PostgreSQL Nativo (desactivando Docker)

#### 1. Detener contenedores de Docker
```bash
docker compose down
```

#### 2. Iniciar el servicio PostgreSQL nativo

- **Windows**
```bash
net start postgresql-x64-13
```
