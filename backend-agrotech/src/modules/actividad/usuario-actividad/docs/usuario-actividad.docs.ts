import { CreateUsuarioActividadDto } from '../dto/create-usuario-actividad.dto';
import { UpdateUsuarioActividadDto } from '../dto/update-usuario-actividad.dto';

export const UsuarioActividadDocs = {
  create: {
    operation: { summary: 'Crear una nueva relación usuario-actividad' },
    response: [
      { status: 201, description: 'Relación usuario-actividad creada exitosamente', schema: { $ref: '#/components/schemas/CreateUsuarioActividadDto' }, example: {
        id_usuario_actividad_pk: 1,
        dni_usuario_fk: '1023456789',
        id_actividad_fk: 7,
      }},
      { status: 400, description: 'Datos inválidos' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
    body: { type: CreateUsuarioActividadDto, example: {
      dni_usuario_fk: '1023456789',
      id_actividad_fk: 7,
    } },
  },

  findAll: {
    operation: { summary: 'Obtener todas las relaciones usuario-actividad' },
    response: [
      { status: 200, description: 'Listado de relaciones obtenido', example: [
        {
          id_usuario_actividad_pk: 1,
          dni_usuario_fk: '1023456789',
          id_actividad_fk: 7,
        },
        {
          id_usuario_actividad_pk: 2,
          dni_usuario_fk: '9876543210',
          id_actividad_fk: 8,
        },
      ] },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },

  findOne: {
    operation: { summary: 'Obtener una relación usuario-actividad por ID' },
    response: [
      { status: 200, description: 'Relación obtenida', example: {
        id_usuario_actividad_pk: 1,
        dni_usuario_fk: '1023456789',
        id_actividad_fk: 7,
      }},
      { status: 404, description: 'Relación no encontrada' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },

  update: {
    operation: { summary: 'Actualizar una relación usuario-actividad existente' },
    response: [
      { status: 200, description: 'Relación actualizada exitosamente', example: {
        id_usuario_actividad_pk: 1,
        dni_usuario_fk: '9876543210',
        id_actividad_fk: 7,
      }},
      { status: 400, description: 'Datos inválidos' },
      { status: 404, description: 'Relación no encontrada' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
    body: { type: UpdateUsuarioActividadDto, example: {
      dni_usuario_fk: '9876543210',
    } },
  },

  remove: {
    operation: { summary: 'Eliminar una relación usuario-actividad' },
    response: [
      { status: 200, description: 'Relación eliminada correctamente', example: { id_usuario_actividad_pk: 1 } },
      { status: 404, description: 'Relación no encontrada' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },

  restore: {
    operation: { summary: 'Restaurar una relación usuario-actividad eliminada' },
    response: [
      { status: 200, description: 'Relación restaurada correctamente', example: {
        id_usuario_actividad_pk: 1,
        dni_usuario_fk: '1023456789',
        id_actividad_fk: 7,
      }},
      { status: 404, description: 'Relación no encontrada' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },
};