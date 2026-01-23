import { CreateCultivoDto } from '../dto/create-cultivo.dto';
import { UpdateCultivoDto } from '../dto/update-cultivo.dto';

export const CultivosDocs = {
  create: {
    operation: { summary: 'Crear un nuevo cultivo' },
    response: [
      {
        status: 201,
        description: 'Cultivo creado exitosamente',
        schema: { $ref: '#/components/schemas/CreateCultivoDto' },
        example: {
          id_cultivo_pk: 1,
          nombre_cultivo: 'Plátano',
          descripcion_cultivo: 'Cacao fino de aroma',
          img_cultivo: 'img/mi-servidor.com/imagenes/cacao.jpg',
          estado_cultivo: 'activo',
          fecha_inicio_cultivo: '2025-03-15',
          fecha_fin_cultivo: '2025-07-30',
          id_sublote_fk: 3,
          id_tipo_cultivo_fk: 2,
        },
      },
      { status: 400, description: 'Datos inválidos' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
    body: {
      type: CreateCultivoDto,
      example: {
        nombre_cultivo: 'Plátano',
        descripcion_cultivo: 'Cacao fino de aroma',
        img_cultivo: 'img/mi-servidor.com/imagenes/cacao.jpg',
        estado_cultivo: 'activo',
        fecha_inicio_cultivo: '2025-03-15',
        fecha_fin_cultivo: '2025-07-30',
        id_sublote_fk: 3,
        id_tipo_cultivo_fk: 2,
      },
    },
  },

  findAll: {
    operation: { summary: 'Obtener todos los cultivos' },
    response: [
      {
        status: 200,
        description: 'Listado de cultivos obtenido',
        example: [
          {
            id_cultivo_pk: 1,
            nombre_cultivo: 'Plátano',
            descripcion_cultivo: 'Cacao fino de aroma',
            img_cultivo: 'img/mi-servidor.com/imagenes/cacao.jpg',
            estado_cultivo: 'activo',
            fecha_inicio_cultivo: '2025-03-15',
            fecha_fin_cultivo: '2025-07-30',
            id_sublote_fk: 3,
            id_tipo_cultivo_fk: 2,
          },
          {
            id_cultivo_pk: 2,
            nombre_cultivo: 'Café',
            descripcion_cultivo: 'Café colombiano',
            img_cultivo: 'img/mi-servidor.com/imagenes/cafe.jpg',
            estado_cultivo: 'activo',
            fecha_inicio_cultivo: '2025-04-01',
            fecha_fin_cultivo: '2025-08-15',
            id_sublote_fk: 4,
            id_tipo_cultivo_fk: 3,
          },
        ],
      },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },

  findOne: {
    operation: { summary: 'Obtener un cultivo por ID' },
    response: [
      {
        status: 200,
        description: 'Cultivo obtenido',
        example: {
          id_cultivo_pk: 1,
          nombre_cultivo: 'Plátano',
          descripcion_cultivo: 'Cacao fino de aroma',
          img_cultivo: 'img/mi-servidor.com/imagenes/cacao.jpg',
          estado_cultivo: 'activo',
          fecha_inicio_cultivo: '2025-03-15',
          fecha_fin_cultivo: '2025-07-30',
          id_sublote_fk: 3,
          id_tipo_cultivo_fk: 2,
        },
      },
      { status: 404, description: 'Cultivo no encontrado' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },

  update: {
    operation: { summary: 'Actualizar un cultivo existente' },
    response: [
      {
        status: 200,
        description: 'Cultivo actualizado exitosamente',
        example: {
          id_cultivo_pk: 1,
          nombre_cultivo: 'Plátano Actualizado',
          descripcion_cultivo: 'Cacao fino de aroma mejorado',
          img_cultivo: 'img/mi-servidor.com/imagenes/cacao_actualizado.jpg',
          estado_cultivo: 'activo',
          fecha_inicio_cultivo: '2025-03-15',
          fecha_fin_cultivo: '2025-07-30',
          id_sublote_fk: 3,
          id_tipo_cultivo_fk: 2,
        },
      },
      { status: 400, description: 'Datos inválidos' },
      { status: 404, description: 'Cultivo no encontrado' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
    body: {
      type: UpdateCultivoDto,
      example: {
        nombre_cultivo: 'Plátano Actualizado',
        descripcion_cultivo: 'Cacao fino de aroma mejorado',
        img_cultivo: 'img/mi-servidor.com/imagenes/cacao_actualizado.jpg',
      },
    },
  },

  remove: {
    operation: { summary: 'Eliminar un cultivo' },
    response: [
      {
        status: 200,
        description: 'Cultivo eliminado correctamente',
        example: { message: 'Cultivo con ID 1 eliminado correctamente' },
      },
      { status: 404, description: 'Cultivo no encontrado' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },

  restore: {
    operation: { summary: 'Restaurar un cultivo eliminado' },
    response: [
      {
        status: 200,
        description: 'Cultivo restaurado correctamente',
        example: { message: 'Cultivo con ID 1 restaurado correctamente' },
      },
      { status: 404, description: 'Cultivo no encontrado' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },
};
