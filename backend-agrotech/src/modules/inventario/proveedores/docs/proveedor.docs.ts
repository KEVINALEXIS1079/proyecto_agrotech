import { CreateProveedorDto } from '../dto/create-proveedor.dto';
import { UpdateProveedorDto } from '../dto/update-proveedor.dto';

export const ProveedoresDocs = {
  create: {
    operation: { summary: 'Crear un nuevo proveedor' },
    response: [
      { status: 201, description: 'Proveedor creado exitosamente', schema: { $ref: '#/components/schemas/CreateProveedorDto' }, example: {
        id_proveedor_pk: 1,
        nombre_proveedor: 'Agroinsumos del Valle',
        contacto_proveedor: 'Juan Pérez',
        telefono_proveedor: '+57 310 123 4567',
        direccion_proveedor: 'Calle 123 # 45-67, Ciudad',
        estado_proveedor: 'A',
      }},
      { status: 400, description: 'Datos inválidos' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
    body: { type: CreateProveedorDto, example: {
      nombre_proveedor: 'Agroinsumos del Valle',
      contacto_proveedor: 'Juan Pérez',
      telefono_proveedor: '+57 310 123 4567',
      direccion_proveedor: 'Calle 123 # 45-67, Ciudad',
      estado_proveedor: 'A',
    } },
  },

  findAll: {
    operation: { summary: 'Obtener todos los proveedores' },
    response: [
      { status: 200, description: 'Listado de proveedores obtenido', example: [
        {
          id_proveedor_pk: 1,
          nombre_proveedor: 'Agroinsumos del Valle',
          contacto_proveedor: 'Juan Pérez',
          telefono_proveedor: '+57 310 123 4567',
          direccion_proveedor: 'Calle 123 # 45-67, Ciudad',
          estado_proveedor: 'A',
        },
        {
          id_proveedor_pk: 2,
          nombre_proveedor: 'Fertilizantes Andinos',
          contacto_proveedor: 'María García',
          telefono_proveedor: '+57 320 987 6543',
          direccion_proveedor: 'Av. Principal # 89-10, Ciudad',
          estado_proveedor: 'A',
        }
      ] },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },

  findOne: {
    operation: { summary: 'Obtener un proveedor por ID' },
    response: [
      { status: 200, description: 'Proveedor obtenido', example: {
        id_proveedor_pk: 1,
        nombre_proveedor: 'Agroinsumos del Valle',
        contacto_proveedor: 'Juan Pérez',
        telefono_proveedor: '+57 310 123 4567',
        direccion_proveedor: 'Calle 123 # 45-67, Ciudad',
        estado_proveedor: 'A',
      }},
      { status: 404, description: 'Proveedor no encontrado' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },

  update: {
    operation: { summary: 'Actualizar un proveedor existente' },
    response: [
      { status: 200, description: 'Proveedor actualizado exitosamente', example: {
        id_proveedor_pk: 1,
        nombre_proveedor: 'Agroinsumos del Valle S.A.',
        contacto_proveedor: 'Carlos Rodríguez',
        telefono_proveedor: '+57 310 123 4567',
        direccion_proveedor: 'Calle 123 # 45-67, Ciudad',
        estado_proveedor: 'A',
      }},
      { status: 400, description: 'Datos inválidos' },
      { status: 404, description: 'Proveedor no encontrado' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
    body: { type: UpdateProveedorDto, example: {
      nombre_proveedor: 'Agroinsumos del Valle S.A.',
      contacto_proveedor: 'Carlos Rodríguez',
    } },
  },

  remove: {
    operation: { summary: 'Eliminar un proveedor' },
    response: [
      { status: 200, description: 'Proveedor eliminado correctamente', example: { id_proveedor_pk: 1 } },
      { status: 404, description: 'Proveedor no encontrado' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },

  restore: {
    operation: { summary: 'Restaurar un proveedor eliminado' },
    response: [
      { status: 200, description: 'Proveedor restaurado correctamente', example: {
        id_proveedor_pk: 1,
        nombre_proveedor: 'Agroinsumos del Valle',
        contacto_proveedor: 'Juan Pérez',
        telefono_proveedor: '+57 310 123 4567',
        direccion_proveedor: 'Calle 123 # 45-67, Ciudad',
        estado_proveedor: 'A',
      }},
      { status: 404, description: 'Proveedor no encontrado' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },
};