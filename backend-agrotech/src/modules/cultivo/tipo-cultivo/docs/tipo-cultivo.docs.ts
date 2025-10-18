import { CreateTipoCultivoDto } from '../dto/create-tipo-cultivo.dto';
import { UpdateTipoCultivoDto } from '../dto/update-tipo-cultivo.dto';

export const TipoCultivoDocs = {
  create: {
    operation: { summary: 'Crear un nuevo tipo de cultivo' },
    response: [
      { status: 201, description: 'Tipo de cultivo creado exitosamente', schema: { $ref: '#/components/schemas/CreateTipoCultivoDto' }, example: { nombre: 'Banano' } },
      { status: 400, description: 'Datos inválidos' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
    body: { type: CreateTipoCultivoDto, example: { nombre: 'Banano' } },
  },

  findAll: {
    operation: { summary: 'Obtener todos los tipos de cultivo' },
    response: [
      { status: 200, description: 'Listado obtenido', example: [{ id: 1, nombre: 'Banano' }] },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },

  findOne: {
    operation: { summary: 'Obtener un tipo de cultivo por ID' },
    response: [
      { status: 200, description: 'Tipo de cultivo obtenido', example: { id: 1, nombre: 'Banano' } },
      { status: 404, description: 'No encontrado' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },

  update: {
    operation: { summary: 'Actualizar un tipo de cultivo' },
    response: [
      { status: 200, description: 'Actualizado exitosamente', example: { id: 1, nombre: 'Cacao' } },
      { status: 400, description: 'Datos inválidos' },
      { status: 404, description: 'No encontrado' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
    body: { type: UpdateTipoCultivoDto, example: { nombre: 'Cacao' } },
  },

  remove: {
    operation: { summary: 'Eliminar un tipo de cultivo' },
    response: [
      { status: 200, description: 'Eliminado correctamente', example: { id: 1 } },
      { status: 404, description: 'No encontrado' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },

  restore: {
    operation: { summary: 'Restaurar un tipo de cultivo eliminado' },
    response: [
      { status: 200, description: 'Restaurado correctamente', example: { id: 1, nombre: 'Banano' } },
      { status: 404, description: 'No encontrado' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },
};
