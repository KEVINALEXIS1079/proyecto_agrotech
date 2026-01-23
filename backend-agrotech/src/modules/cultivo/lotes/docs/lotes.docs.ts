import { CreateLoteDto } from '../dto/create-lote.dto';
import { UpdateLoteDto } from '../dto/update-lote.dto';

export const LotesDocs = {
  create: {
    operation: { summary: 'Crear un nuevo lote' },
    response: [
      { status: 201, description: 'Lote creado exitosamente', schema: { $ref: '#/components/schemas/CreateLoteDto' }, example: {
        nombre_lote: 'Bloque A',
        area_lote: 120,
        coordenadas_lote: [
          { latitud_lote: 4.611, longitud_lote: -74.082 },
          { latitud_lote: 4.611, longitud_lote: -74.081 },
          { latitud_lote: 4.610, longitud_lote: -74.081 },
          { latitud_lote: 4.610, longitud_lote: -74.082 },
        ]
      }},
      { status: 400, description: 'Datos inválidos' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
    body: { type: CreateLoteDto, example: {
      nombre_lote: 'Bloque A',
      area_lote: 120,
      coordenadas_lote: [
        { latitud_lote: 4.611, longitud_lote: -74.082 },
        { latitud_lote: 4.611, longitud_lote: -74.081 },
        { latitud_lote: 4.610, longitud_lote: -74.081 },
        { latitud_lote: 4.610, longitud_lote: -74.082 },
      ]
    } },
  },

  findAll: {
    operation: { summary: 'Obtener todos los lotes' },
    response: [
      { status: 200, description: 'Listado de lotes obtenido', example: [
        {
          id_lote_pk: 1,
          nombre_lote: 'Bloque A',
          area_lote: 120,
          coordenadas_lote: [
            { latitud_lote: 4.611, longitud_lote: -74.082 },
            { latitud_lote: 4.611, longitud_lote: -74.081 },
          ]
        }
      ] },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },

  findOne: {
    operation: { summary: 'Obtener un lote por ID' },
    response: [
      { status: 200, description: 'Lote obtenido', example: {
        id_lote_pk: 1,
        nombre_lote: 'Bloque A',
        area_lote: 120,
        coordenadas_lote: [
          { latitud_lote: 4.611, longitud_lote: -74.082 },
          { latitud_lote: 4.611, longitud_lote: -74.081 },
        ]
      }},
      { status: 404, description: 'Lote no encontrado' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },

  update: {
    operation: { summary: 'Actualizar un lote existente' },
    response: [
      { status: 200, description: 'Lote actualizado exitosamente', example: {
        id_lote_pk: 1,
        nombre_lote: 'Bloque B',
        area_lote: 130,
        coordenadas_lote: [
          { latitud_lote: 4.612, longitud_lote: -74.082 },
          { latitud_lote: 4.612, longitud_lote: -74.081 },
        ]
      }},
      { status: 400, description: 'Datos inválidos' },
      { status: 404, description: 'Lote no encontrado' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
    body: { type: UpdateLoteDto, example: {
      nombre_lote: 'Bloque B',
      area_lote: 130,
      coordenadas_lote: [
        { latitud_lote: 4.612, longitud_lote: -74.082 },
        { latitud_lote: 4.612, longitud_lote: -74.081 },
      ]
    } },
  },

  remove: {
    operation: { summary: 'Eliminar un lote' },
    response: [
      { status: 200, description: 'Lote eliminado correctamente', example: { id_lote_pk: 1 } },
      { status: 404, description: 'Lote no encontrado' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },

  restore: {
    operation: { summary: 'Restaurar un lote eliminado' },
    response: [
      { status: 200, description: 'Lote restaurado correctamente', example: {
        id_lote_pk: 1,
        nombre_lote: 'Bloque A',
        area_lote: 120,
        coordenadas_lote: [
          { latitud_lote: 4.611, longitud_lote: -74.082 },
          { latitud_lote: 4.611, longitud_lote: -74.081 },
        ]
      }},
      { status: 404, description: 'Lote no encontrado' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },
};
