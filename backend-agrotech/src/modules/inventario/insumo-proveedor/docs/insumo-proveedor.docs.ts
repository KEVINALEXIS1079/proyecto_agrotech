import { CreateInsumoProveedorDto } from '../dto/create-insumo-proveedor.dto';
import { UpdateInsumoProveedorDto } from '../dto/update-insumo-proveedor.dto';

export const InsumoProveedorDocs = {
  create: {
    operation: { summary: 'Crear una nueva relación insumo-proveedor' },
    response: [
      { status: 201, description: 'Relación insumo-proveedor creada exitosamente', schema: { $ref: '#/components/schemas/CreateInsumoProveedorDto' }, example: {
        id_insumo_proveedor_pk: 1,
        id_insumo_fk: 1,
        id_proveedor_fk: 2,
      }},
      { status: 400, description: 'Datos inválidos' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
    body: { type: CreateInsumoProveedorDto, example: {
      id_insumo_fk: 1,
      id_proveedor_fk: 2,
    } },
  },

  findAll: {
    operation: { summary: 'Obtener todas las relaciones insumo-proveedor' },
    response: [
      { status: 200, description: 'Listado de relaciones obtenido', example: [
        {
          id_insumo_proveedor_pk: 1,
          id_insumo_fk: 1,
          id_proveedor_fk: 2,
        },
        {
          id_insumo_proveedor_pk: 2,
          id_insumo_fk: 5,
          id_proveedor_fk: 7,
        },
        {
          id_insumo_proveedor_pk: 3,
          id_insumo_fk: 1,
          id_proveedor_fk: 8,
        },
        {
          id_insumo_proveedor_pk: 4,
          id_insumo_fk: 3,
          id_proveedor_fk: 2,
        }
      ] },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },

  findOne: {
    operation: { summary: 'Obtener una relación insumo-proveedor por ID' },
    response: [
      { status: 200, description: 'Relación obtenida', example: {
        id_insumo_proveedor_pk: 1,
        id_insumo_fk: 1,
        id_proveedor_fk: 2,
      }},
      { status: 404, description: 'Relación no encontrada' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },

  update: {
    operation: { summary: 'Actualizar una relación insumo-proveedor existente' },
    response: [
      { status: 200, description: 'Relación actualizada exitosamente', example: {
        id_insumo_proveedor_pk: 1,
        id_insumo_fk: 5,
        id_proveedor_fk: 2,
      }},
      { status: 400, description: 'Datos inválidos' },
      { status: 404, description: 'Relación no encontrada' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
    body: { type: UpdateInsumoProveedorDto, example: {
      id_insumo_fk: 5,
    } },
  },

  remove: {
    operation: { summary: 'Eliminar una relación insumo-proveedor' },
    response: [
      { status: 200, description: 'Relación eliminada correctamente', example: { id_insumo_proveedor_pk: 1 } },
      { status: 404, description: 'Relación no encontrada' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },

  restore: {
    operation: { summary: 'Restaurar una relación insumo-proveedor eliminada' },
    response: [
      { status: 200, description: 'Relación restaurada correctamente', example: {
        id_insumo_proveedor_pk: 1,
        id_insumo_fk: 1,
        id_proveedor_fk: 2,
      }},
      { status: 404, description: 'Relación no encontrada' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },
};