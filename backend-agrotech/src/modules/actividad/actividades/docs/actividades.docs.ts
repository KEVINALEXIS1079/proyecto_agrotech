import { CreateActividadDto } from '../dto/create-actividad.dto';
import { UpdateActividadDto } from '../dto/update-actividad.dto';

export const ActividadesDocs = {
  create: {
    operation: {
      summary: 'Crear una nueva actividad',
      description: 'Registra una nueva actividad en el sistema. Requiere el permiso "actividad:actividades:create".'
    },
    body: { type: CreateActividadDto },
    examples: {
      valido: {
        value: {
          estado_actividad: 'En progreso',
          descripcion_actividad: 'Podar las plantas en el lote 3 para mejorar la producción',
          nombre_actividad: 'Poda de plátano',
          tiempo_actividad: 4,
          costo_mano_obra_actividad: 150000,
          fecha_actividad: '2025-09-19',
          fecha_inicio_actividad: '2025-09-20',
          fecha_fin_actividad: '2025-09-25',
          id_tipo_actividad_fk: 2,
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          estado_actividad: '',
          descripcion_actividad: '',
          nombre_actividad: 'a',
          tiempo_actividad: -1,
          costo_mano_obra_actividad: -50000,
          fecha_actividad: '2025-13-01',
          fecha_inicio_actividad: '2025-09-26',
          fecha_fin_actividad: '2025-09-25',
          id_tipo_actividad_fk: 0,
        },
        summary: 'Ejemplo inválido',
      },
    },
    responses: {
      201: {
        description: 'Actividad creada exitosamente',
        schema: {
          example: {
            id_actividad_pk: 1,
            estado_actividad: 'En progreso',
            descripcion_actividad: 'Podar las plantas en el lote 3 para mejorar la producción',
            nombre_actividad: 'Poda de plátano',
            tiempo_actividad: 4,
            costo_mano_obra_actividad: 150000,
            fecha_actividad: '2025-09-19',
            fecha_inicio_actividad: '2025-09-20',
            fecha_fin_actividad: '2025-09-25',
            id_tipo_actividad_fk: 2,
          },
        },
      },
      401: { description: 'No autenticado' },
      403: { description: 'No autorizado (permiso insuficiente)' },
    },
  },

  findAll: {
    operation: { summary: 'Obtener todas las actividades' },
    responses: {
      200: {
        description: 'Lista de actividades',
        schema: {
          example: [
            {
              id_actividad_pk: 1,
              estado_actividad: 'En progreso',
              descripcion_actividad: 'Podar las plantas en el lote 3 para mejorar la producción',
              nombre_actividad: 'Poda de plátano',
              tiempo_actividad: 4,
              costo_mano_obra_actividad: 150000,
              fecha_actividad: '2025-09-19',
              fecha_inicio_actividad: '2025-09-20',
              fecha_fin_actividad: '2025-09-25',
              id_tipo_actividad_fk: 2,
            },
          ],
        },
      },
      401: { description: 'No autenticado' },
      403: { description: 'No autorizado (permiso insuficiente)' },
    },
  },

  findOne: {
    operation: { summary: 'Obtener actividad por ID' },
    responses: {
      200: {
        description: 'Actividad encontrada',
        schema: {
          example: {
            id_actividad_pk: 1,
            estado_actividad: 'En progreso',
            descripcion_actividad: 'Podar las plantas en el lote 3',
            nombre_actividad: 'Poda de plátano',
            tiempo_actividad: 4,
            costo_mano_obra_actividad: 150000,
            fecha_actividad: '2025-09-19',
            fecha_inicio_actividad: '2025-09-20',
            fecha_fin_actividad: '2025-09-25',
            id_tipo_actividad_fk: 2,
          },
        },
      },
      401: { description: 'No autenticado' },
      403: { description: 'No autorizado' },
      404: { description: 'Actividad no encontrada' },
    },
  },

  update: {
    operation: { summary: 'Actualizar una actividad' },
    body: { type: UpdateActividadDto },
    examples: {
      valido: {
        value: {
          estado_actividad: 'Completada',
          descripcion_actividad: 'Podar las plantas en el lote 3 (finalizado)',
          nombre_actividad: 'Poda de plátano (actualizado)',
          tiempo_actividad: 5,
          costo_mano_obra_actividad: 160000,
          fecha_fin_actividad: '2025-09-26',
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          estado_actividad: '',
          tiempo_actividad: -1,
          costo_mano_obra_actividad: -50000,
          fecha_fin_actividad: '2025-09-19',
        },
        summary: 'Ejemplo inválido',
      },
    },
    responses: {
      200: {
        description: 'Actividad actualizada exitosamente',
        schema: {
          example: {
            id_actividad_pk: 1,
            estado_actividad: 'Completada',
            descripcion_actividad: 'Podar las plantas en el lote 3 (finalizado)',
            nombre_actividad: 'Poda de plátano (actualizado)',
            tiempo_actividad: 5,
            costo_mano_obra_actividad: 160000,
            fecha_actividad: '2025-09-19',
            fecha_inicio_actividad: '2025-09-20',
            fecha_fin_actividad: '2025-09-26',
            id_tipo_actividad_fk: 2,
          },
        },
      },
      401: { description: 'No autenticado' },
      403: { description: 'No autorizado' },
      404: { description: 'Actividad no encontrada' },
    },
  },

  remove: {
    operation: { summary: 'Eliminar una actividad' },
    responses: {
      200: {
        description: 'Actividad eliminada correctamente',
        schema: { example: { message: 'Actividad con ID 1 eliminada correctamente' } },
      },
      401: { description: 'No autenticado' },
      403: { description: 'No autorizado' },
      404: { description: 'Actividad no encontrada' },
    },
  },

  restore: {
    operation: { summary: 'Restaurar una actividad eliminada' },
    responses: {
      200: {
        description: 'Actividad restaurada correctamente',
        schema: { example: { message: 'Actividad con ID 1 restaurada correctamente' } },
      },
      401: { description: 'No autenticado' },
      403: { description: 'No autorizado' },
      404: { description: 'Actividad no encontrada' },
    },
  },
};
