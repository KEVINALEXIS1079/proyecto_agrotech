import { INestApplication } from '@nestjs/common';
import { AsyncApiDocumentBuilder, AsyncApiModule } from 'nestjs-asyncapi';

/**
 * setupAsyncApi(app)
 * - Crea documentBase con AsyncApiDocumentBuilder
 * - Añade manualmente la sección "channels" para describir tus eventos
 * - Monta la UI en /asyncapi
 */
export async function setupAsyncApi(app: INestApplication) {
  const base = new AsyncApiDocumentBuilder()
    .setTitle('Agrotech WebSocket API')
    .setDescription('Documentación AsyncAPI (Socket.IO) — canales de lotes')
    .setVersion('1.0.0')
    .setDefaultContentType('application/json')
    .addServer('ws', {
      url: 'ws://localhost:4000',
      protocol: 'socket.io',
      description: 'Servidor WebSocket local',
    })
    .build();

  // createDocument devuelve un objeto que podemos extender
  const asyncApiDoc = AsyncApiModule.createDocument(app, base) as any;

  // --- Definimos los channels que usa nuestro Gateway ---
  // Puedes ampliar/matricular schemas más precisos según tus DTOs
  const loteSchema = {
    type: 'object',
    properties: {
      id_lote_pk: { type: 'number' },
      nombre_lote: { type: 'string' },
      area_lote: { type: 'number' },
      coordenadas_lote: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            latitud_lote: { type: 'number' },
            longitud_lote: { type: 'number' },
          },
        },
      },
    },
  };

  const channels = {
    'lotes/create': {
      subscribe: {
        summary: 'Cliente -> crear lote',
        message: {
          name: 'createLote',
          payload: {
            type: 'object',
            // cliente envía (parcial) del lote a crear (sin id)
            properties: {
              nombre_lote: { type: 'string' },
              coordenadas_lote: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    latitud_lote: { type: 'number' },
                    longitud_lote: { type: 'number' },
                  },
                },
              },
            },
            required: ['nombre_lote', 'coordenadas_lote'],
          },
        },
      },
    },
    'lotes/created': {
      publish: {
        summary: 'Servidor -> notifica lote creado (broadcast)',
        message: {
          name: 'loteCreated',
          payload: loteSchema,
        },
      },
    },

    'lotes/update': {
      subscribe: {
        summary: 'Cliente -> actualizar lote',
        message: {
          name: 'updateLote',
          payload: {
            type: 'object',
            properties: {
              id_lote_pk: { type: 'number' },
              nombre_lote: { type: 'string' },
              coordenadas_lote: { $ref: '#/components/schemas/Coordenadas' },
              area_lote: { type: 'number' },
            },
            required: ['id_lote_pk'],
          },
        },
      },
    },
    'lotes/updated': {
      publish: {
        summary: 'Servidor -> notifica lote actualizado',
        message: {
          name: 'loteUpdated',
          payload: loteSchema,
        },
      },
    },

    'lotes/list': {
      subscribe: {
        summary: 'Cliente -> solicitar lista de lotes',
        message: {
          name: 'requestList',
          payload: { type: 'object', properties: {} },
        },
      },
      publish: {
        summary: 'Servidor -> respuesta con lista de lotes',
        message: {
          name: 'loteList',
          payload: {
            type: 'array',
            items: loteSchema,
          },
        },
      },
    },

    'lotes/delete': {
      subscribe: {
        summary: 'Cliente -> solicita eliminación (soft) de lote',
        message: {
          name: 'deleteLote',
          payload: { type: 'object', properties: { id_lote_pk: { type: 'number' } }, required: ['id_lote_pk'] },
        },
      },
    },
    'lotes/deleted': {
      publish: {
        summary: 'Servidor -> confirma eliminación',
        message: {
          name: 'loteDeleted',
          payload: { type: 'object', properties: { id_lote_pk: { type: 'number' } } },
        },
      },
    },

    'lotes/restore': {
      subscribe: {
        summary: 'Cliente -> solicita restaurar lote eliminado',
        message: {
          name: 'restoreLote',
          payload: { type: 'object', properties: { id_lote_pk: { type: 'number' } }, required: ['id_lote_pk'] },
        },
      },
    },
    'lotes/restored': {
      publish: {
        summary: 'Servidor -> confirma restauración',
        message: {
          name: 'loteRestored',
          payload: loteSchema,
        },
      },
    },
  };

  // Añadimos componentes (schemas) y channels al documento AsyncAPI
  asyncApiDoc.channels = {
    ...(asyncApiDoc.channels || {}),
    ...channels,
  };

  asyncApiDoc.components = {
    ...(asyncApiDoc.components || {}),
    schemas: {
      ...(asyncApiDoc.components?.schemas || {}),
      Lote: loteSchema,
      Coordenadas: {
        type: 'object',
        properties: {
          latitud_lote: { type: 'number' },
          longitud_lote: { type: 'number' },
        },
      },
    },
  };

  // Montamos la UI AsyncAPI en /asyncapi
  await AsyncApiModule.setup('/asyncapi', app, asyncApiDoc);

  console.log('⚡ AsyncAPI docs mounted at /asyncapi');
}
