import { CreateEvidenciaDto } from '../dto/create-evidencia.dto';
import { UpdateEvidenciaDto } from '../dto/update-evidencia.dto';

export const EvidenciasDocs = {
  create: {
    operation: { summary: 'Crear una nueva evidencia' },
    response: [
      { status: 201, description: 'Evidencia creada exitosamente', schema: { $ref: '#/components/schemas/CreateEvidenciaDto' }, example: {
        id_evidencia_pk: 1,
        nombre_evidencia: 'Registro fotográfico de la poda',
        descripcion_evidencia: 'Fotografías que muestran el estado del cultivo después de la poda realizada en el lote 2',
        fecha_evidencia: '2025-09-19',
        observacion_evidencia: 'El cultivo presenta un desarrollo saludable tras la poda',
        fecha_inicio_evidencia: '2025-09-20',
        fecha_fin_evidencia: '2025-09-25',
        id_actividad_fk: 12,
        img_evidencia: 'uploads/evidencias/123456789.jpg',
      }},
      { status: 400, description: 'Datos inválidos' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
    body: {
      schema: {
        type: 'object',
        properties: {
          nombre_evidencia: { type: 'string', example: 'Registro fotográfico de la poda' },
          descripcion_evidencia: { type: 'string', example: 'Fotografías que muestran el estado del cultivo después de la poda realizada en el lote 2' },
          fecha_evidencia: { type: 'string', format: 'date', example: '2025-09-19' },
          observacion_evidencia: { type: 'string', example: 'El cultivo presenta un desarrollo saludable tras la poda' },
          fecha_inicio_evidencia: { type: 'string', format: 'date', example: '2025-09-20' },
          fecha_fin_evidencia: { type: 'string', format: 'date', example: '2025-09-25' },
          id_actividad_fk: { type: 'integer', example: 12 },
          img_evidencia: { type: 'string', format: 'binary' },
        },
      },
    },
  },

  findAll: {
    operation: { summary: 'Obtener todas las evidencias' },
    response: [
      { status: 200, description: 'Listado de evidencias obtenido', example: [
        {
          id_evidencia_pk: 1,
          nombre_evidencia: 'Registro fotográfico de la poda',
          id_actividad_fk: 12,
        },
        {
          id_evidencia_pk: 2,
          nombre_evidencia: 'Evidencia de riego',
          id_actividad_fk: 13,
        },
      ] },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },

  findOne: {
    operation: { summary: 'Obtener una evidencia por ID' },
    response: [
      { status: 200, description: 'Evidencia obtenida', example: {
        id_evidencia_pk: 1,
        nombre_evidencia: 'Registro fotográfico de la poda',
        descripcion_evidencia: 'Fotografías que muestran el estado del cultivo después de la poda realizada en el lote 2',
        fecha_evidencia: '2025-09-19',
        observacion_evidencia: 'El cultivo presenta un desarrollo saludable tras la poda',
        fecha_inicio_evidencia: '2025-09-20',
        fecha_fin_evidencia: '2025-09-25',
        id_actividad_fk: 12,
        img_evidencia: 'uploads/evidencias/123456789.jpg',
      }},
      { status: 404, description: 'Evidencia no encontrada' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },

  update: {
    operation: { summary: 'Actualizar una evidencia existente' },
    response: [
      { status: 200, description: 'Evidencia actualizada exitosamente', example: {
        id_evidencia_pk: 1,
        nombre_evidencia: 'Registro actualizado de la poda',
        descripcion_evidencia: 'Fotografías actualizadas del cultivo tras la poda',
        fecha_evidencia: '2025-09-19',
        observacion_evidencia: 'Cultivo en excelente estado tras actualización',
        fecha_inicio_evidencia: '2025-09-20',
        fecha_fin_evidencia: '2025-09-25',
        id_actividad_fk: 12,
        img_evidencia: 'uploads/evidencias/123456789_updated.jpg',
      }},
      { status: 400, description: 'Datos inválidos' },
      { status: 404, description: 'Evidencia no encontrada' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
    body: { type: UpdateEvidenciaDto, example: {
      nombre_evidencia: 'Registro actualizado de la poda',
      descripcion_evidencia: 'Fotografías actualizadas del cultivo tras la poda',
      observacion_evidencia: 'Cultivo en excelente estado tras actualización',
    } },
  },

  remove: {
    operation: { summary: 'Eliminar una evidencia' },
    response: [
      { status: 200, description: 'Evidencia eliminada correctamente', example: { id_evidencia_pk: 1 } },
      { status: 404, description: 'Evidencia no encontrada' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },

  restore: {
    operation: { summary: 'Restaurar una evidencia eliminada' },
    response: [
      { status: 200, description: 'Evidencia restaurada correctamente', example: {
        id_evidencia_pk: 1,
        nombre_evidencia: 'Registro fotográfico de la poda',
        descripcion_evidencia: 'Fotografías que muestran el estado del cultivo después de la poda realizada en el lote 2',
        fecha_evidencia: '2025-09-19',
        observacion_evidencia: 'El cultivo presenta un desarrollo saludable tras la poda',
        fecha_inicio_evidencia: '2025-09-20',
        fecha_fin_evidencia: '2025-09-25',
        id_actividad_fk: 12,
        img_evidencia: 'uploads/evidencias/123456789.jpg',
      }},
      { status: 404, description: 'Evidencia no encontrada' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },
};