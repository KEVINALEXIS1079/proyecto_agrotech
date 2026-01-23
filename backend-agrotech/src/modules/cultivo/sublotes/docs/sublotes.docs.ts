import { CreateSubloteDto } from '../dto/create-sublote.dto';
import { UpdateSubloteDto } from '../dto/update-sublote.dto';

export const SublotesDocs = {
  create: {
    operation: {
      summary: 'Crear un nuevo sublote',
      description: 'Registra un nuevo sublote en el sistema. Requiere el permiso "cultivo:sublotes:create".',
    },
    body: {
      type: CreateSubloteDto,
      examples: {
        valido: {
          summary: 'Ejemplo válido',
          value: {
            latitud_sublote: 6.25,
            longitud_sublote: 5.56,
            nombre_sublote: 'Cacao 2',
            descripcion_sublote: 'Sublote destinado a cultivo de cacao',
            id_lote_fk: 3,
          },
        },
        invalido: {
          summary: 'Ejemplo inválido',
          value: {
            latitud_sublote: '6.25',
            longitud_sublote: '5.56',
            nombre_sublote: '',
            descripcion_sublote: '',
            id_lote_fk: -1,
          },
        },
      },
    },
    response: [
      {
        status: 201,
        description: 'Sublote creado exitosamente',
        schema: { example: {
          id_sublote_pk: 1,
          latitud_sublote: 6.25,
          longitud_sublote: 5.56,
          nombre_sublote: 'Cacao 2',
          descripcion_sublote: 'Sublote destinado a cultivo de cacao',
          id_lote_fk: 3,
        }},
      },
      { status: 401, description: 'No autenticado' },
      { status: 403, description: 'No autorizado (permiso insuficiente)' },
    ],
  },

  findAll: {
    operation: {
      summary: 'Obtener todos los sublotes',
      description: 'Devuelve la lista completa de sublotes. Requiere el permiso "cultivo:sublotes:read".',
    },
    response: [
      {
        status: 200,
        description: 'Lista de sublotes obtenida exitosamente',
        schema: { example: [
          {
            id_sublote_pk: 1,
            latitud_sublote: 6.25,
            longitud_sublote: 5.56,
            nombre_sublote: 'Cacao 2',
            descripcion_sublote: 'Sublote destinado a cultivo de cacao',
            id_lote_fk: 3,
          },
          {
            id_sublote_pk: 2,
            latitud_sublote: 6.30,
            longitud_sublote: 5.60,
            nombre_sublote: 'Café 1',
            descripcion_sublote: 'Sublote destinado a cultivo de café',
            id_lote_fk: 4,
          },
        ]},
      },
      { status: 401, description: 'No autenticado' },
      { status: 403, description: 'No autorizado (permiso insuficiente)' },
    ],
  },

  findOne: {
    operation: {
      summary: 'Obtener un sublote por ID',
      description: 'Devuelve los detalles de un sublote específico según su ID. Requiere el permiso "cultivo:sublotes:read".',
    },
    response: [
      {
        status: 200,
        description: 'Sublote encontrado',
        schema: { example: {
          id_sublote_pk: 1,
          latitud_sublote: 6.25,
          longitud_sublote: 5.56,
          nombre_sublote: 'Cacao 2',
          descripcion_sublote: 'Sublote destinado a cultivo de cacao',
          id_lote_fk: 3,
        }},
      },
      { status: 401, description: 'No autenticado' },
      { status: 403, description: 'No autorizado (permiso insuficiente)' },
      { status: 404, description: 'Sublote no encontrado' },
    ],
  },

  update: {
    operation: {
      summary: 'Actualizar un sublote',
      description: 'Modifica los detalles de un sublote existente. Requiere el permiso "cultivo:sublotes:update".',
    },
    body: {
      type: UpdateSubloteDto,
      examples: {
        valido: {
          summary: 'Ejemplo válido',
          value: {
            latitud_sublote: 6.26,
            longitud_sublote: 5.57,
            nombre_sublote: 'Cacao 2 Actualizado',
            descripcion_sublote: 'Sublote actualizado para cultivo de cacao',
          },
        },
        invalido: {
          summary: 'Ejemplo inválido',
          value: {
            latitud_sublote: '6.26',
            longitud_sublote: '5.57',
            nombre_sublote: '',
            descripcion_sublote: '',
          },
        },
      },
    },
    response: [
      {
        status: 200,
        description: 'Sublote actualizado exitosamente',
        schema: { example: {
          id_sublote_pk: 1,
          latitud_sublote: 6.26,
          longitud_sublote: 5.57,
          nombre_sublote: 'Cacao 2 Actualizado',
          descripcion_sublote: 'Sublote actualizado para cultivo de cacao',
          id_lote_fk: 3,
        }},
      },
      { status: 400, description: 'Datos inválidos' },
      { status: 401, description: 'No autenticado' },
      { status: 403, description: 'No autorizado (permiso insuficiente)' },
      { status: 404, description: 'Sublote no encontrado' },
    ],
  },

  remove: {
    operation: {
      summary: 'Eliminar un sublote',
      description: 'Elimina un sublote del sistema. Requiere el permiso "cultivo:sublotes:delete".',
    },
    response: [
      {
        status: 200,
        description: 'Sublote eliminado exitosamente',
        schema: { example: { message: 'Sublote con ID 1 eliminado correctamente' } },
      },
      { status: 401, description: 'No autenticado' },
      { status: 403, description: 'No autorizado (permiso insuficiente)' },
      { status: 404, description: 'Sublote no encontrado' },
    ],
  },

  restore: {
    operation: {
      summary: 'Restaurar un sublote eliminado',
      description: 'Restaura un sublote previamente eliminado. Requiere el permiso "cultivo:sublotes:update".',
    },
    response: [
      {
        status: 200,
        description: 'Sublote restaurado exitosamente',
        schema: { example: { message: 'Sublote con ID 1 restaurado correctamente' } },
      },
      { status: 401, description: 'No autenticado' },
      { status: 403, description: 'No autorizado (permiso insuficiente)' },
      { status: 404, description: 'Sublote no encontrado' },
    ],
  },
};
