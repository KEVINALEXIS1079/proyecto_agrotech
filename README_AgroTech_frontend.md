# AgroTech – Frontend  

### Cambios y Mejoras

Este commit corresponde a la nueva versión del frontend, comparada con la versión anterior (`frontend-agrotech2`).  

## Colaboradores  
- Kevin Alexis  
- Dario  

## Cambios principales  

1. **Módulo de Usuarios**
   - Nuevo formulario para **crear usuarios** con campos validados y carga de imágenes.
   - Integración de **roles/permiso** en el registro de usuario (`id_rol_fk`).
   - Página de **lista de usuarios** mejorada con tabla y acciones.  
   - ⚠️ **EditarUsuario:** se implementó la estructura inicial, pero aún presenta error al manejar el `id` del usuario seleccionado. Está pendiente de corrección.

2. **Módulo de Actividades**
   - Creada página de **ListaActividades** con tabla, acciones de edición y eliminación.
   - Definida navegación dinámica con `EDIT_PATH(id)` para acceder a la vista de edición.

3. **Layout General**
   - Ajustado `ProtectedLayout` para incluir **notificaciones**.  
   - Ejemplo implementado: notificación que indica *“El cultivo de cacao presenta bajos niveles de pH”*.  
   - Corrección en el contador de notificaciones para evitar duplicados.  

4. **UI/UX**
   - Se estandarizó el uso de **HeroUI** para inputs, botones, tablas y selects.
   - Uso de iconos con **Lucide-react** para acciones (editar, eliminar, notificaciones).  

## Mejoras frente a la versión anterior
- Se unificó la lógica de usuarios, roles y actividades.  
- Se integraron formularios dinámicos con validaciones y `FormData` para imágenes.  
- La nueva versión es más consistente en diseño, gracias a HeroUI y la estructura modular.  

## Pendientes
- Corregir bug en **EditarUsuario** (manejo de `id`).  
- Implementar búsqueda y filtros en las tablas de usuarios y actividades.  
- Conectar notificaciones con datos reales del backend.  
