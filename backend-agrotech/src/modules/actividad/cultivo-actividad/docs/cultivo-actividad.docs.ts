import { CreateCultivoActividadDto } from '../dto/create-cultivo-actividad.dto';
import { UpdateCultivoActividadDto } from '../dto/update-cultivo-actividad.dto';

export const CultivoActividadDocs = {
  create: {
    operation: {
      summary: 'Crear una nueva relación cultivo-actividad',
      description: 'Asocia una actividad a un cultivo. Requiere el permiso "actividad:cultivo-actividad:create".',
    },
    body: { type: CreateCultivoActividadDto },
    examples: {
      valido: {
        value: { id_cultivo_fk: 5, id_actividad_fk: 12 },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: { id_cultivo_fk: -1, id_actividad_fk: 0 },
        summary: 'Ejemplo inválido',
      },
    },
    responses: {
      201: {
        description: 'Relación creada exitosamente',
        schema: {
          example: { id_cultivo_actividad_pk: 1, id_cultivo_fk: 5, id_actividad_fk: 12 },
        },
      },
      401: { description: 'No autenticado' },
      403: { description: 'No autorizado (permiso insuficiente)' },
    },
  },

  findAll: {
    operation: { summary: 'Obtener todas las relaciones cultivo-actividad' },
    responses: {
      200: {
        description: 'Lista de relaciones obtenida exitosamente',
        schema: {
          example: [
            { id_cultivo_actividad_pk: 1, id_cultivo_fk: 5, id_actividad_fk: 12 },
            { id_cultivo_actividad_pk: 2, id_cultivo_fk: 6, id_actividad_fk: 13 },
          ],
        },
      },
      401: { description: 'No autenticado' },
      403: { description: 'No autorizado' },
    },
  },

  findOne: {
    operation: { summary: 'Obtener una relación cultivo-actividad por ID' },
    responses: {
      200: {
        description: 'Relación encontrada',
        schema: { example: { id_cultivo_actividad_pk: 1, id_cultivo_fk: 5, id_actividad_fk: 12 } },
      },
      401: { description: 'No autenticado' },
      403: { description: 'No autorizado' },
      404: { description: 'Relación no encontrada' },
    },
  },

  update: {
    operation: { summary: 'Actualizar una relación cultivo-actividad' },
    body: { type: UpdateCultivoActividadDto },
    examples: {
      valido: { value: { id_cultivo_fk: 6 }, summary: 'Ejemplo válido' },
      invalido: { value: { id_cultivo_fk: -1 }, summary: 'Ejemplo inválido' },
    },
    responses: {
      200: {
        description: 'Relación actualizada exitosamente',
        schema: { example: { id_cultivo_actividad_pk: 1, id_cultivo_fk: 6, id_actividad_fk: 12 } },
      },
      401: { description: 'No autenticado' },
      403: { description: 'No autorizado' },
      404: { description: 'Relación no encontrada' },
    },
  },

  remove: {
    operation: { summary: 'Eliminar una relación cultivo-actividad' },
    responses: {
      200: {
        description: 'Relación eliminada exitosamente',
        schema: { example: { message: 'Relación con ID 1 eliminada correctamente' } },
      },
      401: { description: 'No autenticado' },
      403: { description: 'No autorizado' },
      404: { description: 'Relación no encontrada' },
    },
  },

  restore: {
    operation: { summary: 'Restaurar una relación cultivo-actividad eliminada' },
    responses: {
      200: {
        description: 'Relación restaurada exitosamente',
        schema: { example: { message: 'Relación con ID 1 restaurada correctamente' } },
      },
      401: { description: 'No autenticado' },
      403: { description: 'No autorizado' },
      404: { description: 'Relación no encontrada' },
    },
  },
};
