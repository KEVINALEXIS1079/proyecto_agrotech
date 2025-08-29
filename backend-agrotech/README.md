# 🌱 Proyecto Agrotech - Backend

Backend del proyecto **Agrotech**, desarrollado con **NestJS** y **PostgreSQL**, estructurado de manera modular por dominios y preparado para despliegue con Docker.

---

## 📦 Estructura del Proyecto

<details>
<summary>📂 Ver estructura</summary>

```bash
backend_agrotech/
├── src/
│   ├── actividad/
│   ├── autenticacion/
│   ├── config/
│   ├── cultivo/
│   ├── finanza/
│   ├── inventario/
│   ├── iot/
│   ├── middleware/
│   ├── usuario/
│   ├── migrations/
│   └── main.ts
├── uploads/
│   └── evidencia/
├── docker-compose.yml
├── package.json
└── tsconfig.json
```
</details>


---

## 🔑 Autenticación y Seguridad

<details>
<summary>🔒 Ver detalles</summary>

- Autenticación con **JWT**  
- Hash de contraseñas con **bcrypt**  
- Creación automática de usuario administrador inicial  
- Middleware para validar roles y permisos  

Ejemplo de login:
```bash
POST /auth/login
{
  "email": "admin@admin.com",
  "password": "admin123"
}
```
</details>

---

## 📂 Subida de Archivos

<details>
<summary>📤 Con Multer</summary>

Los archivos se suben a la carpeta `uploads/evidencia`.

Ejemplo en controlador:
```ts
@Post('upload')
@UseInterceptors(FileInterceptor('file', { dest: './uploads/evidencia' }))
uploadFile(@UploadedFile() file: Express.Multer.File) {
  return { filename: file.filename };
}
```
</details>

---

## 📚 Documentación con Swagger

<details>
<summary>📖 Swagger</summary>

Accede a la URL:
```bash
http://localhost:3000/api/v1
```

Configuración en `main.ts`:
```ts
const config = new DocumentBuilder()
  .setTitle('Agrotech API')
  .setDescription('Documentación de la API Backend Agrotech')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
```
</details>

---

## 🛠️ Tecnologías Principales

- **NestJS** - Framework backend  
- **PostgreSQL** - Base de datos  
- **TypeORM** - ORM y migraciones  
- **JWT** - Autenticación  
- **bcrypt** - Hash de contraseñas  
- **Multer** - Subida de archivos  
- **Swagger** - Documentación API  
- **Docker** - Despliegue  

---

## ✨ Features Implementadas

- 📌 Estructura modular por dominios (usuario, cultivo, inventario, etc.)  
- 🔑 Autenticación JWT con roles y permisos  
- 🔒 Hash de contraseñas con bcrypt  
- 👤 Creación automática de usuario administrador  
- 📂 Subida de archivos con Multer  
- 📚 Documentación con Swagger  
- 🗂️ Migraciones con TypeORM    

---

## 👥 Contribuidores

- 👨‍💻 Oscar Ortega  
- 👨‍💻 Andres Escobar  
