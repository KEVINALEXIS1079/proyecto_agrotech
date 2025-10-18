import { CreateTipoActividadDto } from '../dto/create-tipo-actividad.dto';
import { UpdateTipoActividadDto } from '../dto/update-tipo-actividad.dto';

export const TipoActividadDocs = {
  create: {
    operation: { summary: 'Crear un nuevo tipo de actividad' },
    response: [
      { status: 201, description: 'Tipo de actividad creado exitosamente', schema: { $ref: '#/components/schemas/CreateTipoActividadDto' }, example: {
        id_tipo_actividad_pk: 1,
        nombre_tipo_actividad: 'Riego',
      }},
      { status: 400, description: 'Datos inválidos' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
    body: { type: CreateTipoActividadDto, example: {
      nombre_tipo_actividad: 'Riego',
    } },
  },

  findAll: {
    operation: { summary: 'Obtener todos los tipos de actividad' },
    response: [
      { status: 200, description: 'Listado de tipos de actividad obtenido', example: [
        {
          id_tipo_actividad_pk: 1,
          nombre_tipo_actividad: 'Riego',
        },
        {
          id_tipo_actividad_pk: 2,
          nombre_tipo_actividad: 'Poda',
        },
        {
          id_tipo_actividad_pk: 3,
          nombre_tipo_actividad: 'Fertilización',
        },
        {
          id_tipo_actividad_pk: 4,
          nombre_tipo_actividad: 'Cosecha',
        }
      ] },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },

  findOne: {
    operation: { summary: 'Obtener un tipo de actividad por ID' },
    response: [
      { status: 200, description: 'Tipo de actividad obtenido', example: {
        id_tipo_actividad_pk: 1,
        nombre_tipo_actividad: 'Riego',
      }},
      { status: 404, description: 'Tipo de actividad no encontrado' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },

  update: {
    operation: { summary: 'Actualizar un tipo de actividad existente' },
    response: [
      { status: 200, description: 'Tipo de actividad actualizado exitosamente', example: {
        id_tipo_actividad_pk: 1,
        nombre_tipo_actividad: 'Riego actualizado',
      }},
      { status: 400, description: 'Datos inválidos' },
      { status: 404, description: 'Tipo de actividad no encontrado' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
    body: { type: UpdateTipoActividadDto, example: {
      nombre_tipo_actividad: 'Riego actualizado',
    } },
  },

  remove: {
    operation: { summary: 'Eliminar un tipo de actividad' },
    response: [
      { status: 200, description: 'Tipo de actividad eliminado correctamente', example: { id_tipo_actividad_pk: 1 } },
      { status: 404, description: 'Tipo de actividad no encontrado' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },

  restore: {
    operation: { summary: 'Restaurar un tipo de actividad eliminado' },
    response: [
      { status: 200, description: 'Tipo de actividad restaurado correctamente', example: {
        id_tipo_actividad_pk: 1,
        nombre_tipo_actividad: 'Riego',
      }},
      { status: 404, description: 'Tipo de actividad no encontrado' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },
};