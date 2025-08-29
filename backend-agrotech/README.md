# 🌿 Agrotech Backend

Este repositorio contiene el backend de la aplicación **Agrotech**, desarrollado con **NestJS, TypeORM y PostgreSQL**.  

El sistema implementa:  

- Autenticación con **JWT**  
- Gestión de **roles y permisos**  
- Subida de **evidencias con Multer**  
- Organización modular para escalabilidad  
- Migraciones con **TypeORM**  
- Integración con **Docker y pgAdmin**  

---

## 📦 Estructura del Proyecto  

```bash
backend_agrotech/
src/
├── actividad/              # Módulo para actividades agrícolas
├── autentication/          # Autenticación con JWT y bcrypt
├── configs/                # Configuraciones globales
├── cultivo/                # Módulo de cultivos
├── finanza/                # Gestión de finanzas
├── init/                   # Inicialización (usuario admin por defecto, seeds, etc.)
├── inventario/             # Manejo de inventarios
├── IoT/                    # Integración con dispositivos IoT
├── middleware/             # Middlewares globales
├── migrations/             # Migraciones TypeORM
├── usuario/                # Gestión de usuarios y roles
│   ├── roles/
│   └── usuarios/
├── app.controller.spec.ts
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── data-source.ts          # Configuración de TypeORM
└── main.ts                 # Punto de entrada de la aplicación

uploads/                    # Carpeta donde se almacenan las evidencias
test/                       # Pruebas unitarias
🔑 Autenticación y Roles
Autenticación con JWT

Contraseñas seguras encriptadas con bcrypt

Uso de guards para proteger endpoints

Decoradores personalizados para manejo de roles

Se crea un usuario administrador por defecto en la primera ejecución

json
Copiar código
{
  "correo_usuario": "admin@admin.com",
  "contrasena_usuario": "admin123"
}
🔐 Endpoint de Login
http
Copiar código
POST http://localhost:3000/api/v1/auth/login
Body (JSON):

json
Copiar código
{
  "correo_usuario": "admin@admin.com",
  "contrasena_usuario": "admin123"
}
Respuesta (token JWT):

json
Copiar código
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR..."
}
📂 Evidencias con Multer
Las imágenes se suben con Multer

Se guardan en la carpeta uploads/evidencia

Quedan vinculadas en la tabla correspondiente de la base de datos

⚙ Configuración de TypeORM
Archivo principal: src/data-source.ts

ts
Copiar código
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'host.docker.internal',
  port: 5432,
  username: 'agrotech',
  password: '123',
  database: 'agrotech',
  synchronize: false,
  logging: false,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: [],
});
⚠ IMPORTANTE:
Mantener synchronize: false si usas migraciones.
Si no cargas manualmente las entidades, activa autoLoadEntities: true en AppModule.

🔧 Scripts disponibles
json
Copiar código
"scripts": {
  "typeorm": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js -d src/data-source.ts",
  "migrations:generate": "npm run typeorm -- migration:generate -p",
  "migrations:run": "npm run typeorm -- migration:run",
  "migration:create": "npm run typeorm -- migration:create",
  "start:dev": "nest start --watch"
}
📜 Migraciones
Generar migración automática:

bash
Copiar código
npm run migrations:generate src/migrations/InitialMigration
Crear migración vacía:

bash
Copiar código
npm run migration:create src/migrations/NombreMigracion
Ejecutar migraciones:

bash
Copiar código
npm run migrations:run
🐳 Docker
📋 docker-compose.yml
yaml
Copiar código
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
🐚 Comandos Docker útiles
bash
Copiar código
# Levantar servicios
docker compose up -d

# Detener servicios
docker compose down

# Eliminar contenedores + volúmenes
docker compose down -v

# Reiniciar servicios
docker compose restart

# Ver contenedores activos
docker ps

# Ingresar a PostgreSQL
docker exec -it agrotech_database psql -U agrotech -d agrotech
🌐 Acceder a pgAdmin
Ir a: http://localhost:8080

Credenciales:

Email: admin@admin.com

Contraseña: admin

Crear servidor:

Name: PostgresDocker

Host: postgres

Port: 5432

DB: agrotech

User: agrotech

Password: 123

✨ Características principales
🔑 Autenticación con JWT

🛡 Protección con guards y roles

🔒 Contraseñas seguras con bcrypt

🖼 Subida de archivos con Multer

🗄 Migraciones con TypeORM

🐳 Integración con Docker y pgAdmin

⚙ Arquitectura modular (actividad, cultivo, finanza, IoT, inventario, usuario, etc.)

👨‍💻 Autor
Desarrollado por Oscar Ortega.