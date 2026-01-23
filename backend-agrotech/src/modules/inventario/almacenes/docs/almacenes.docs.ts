import { CreateAlmacenDto } from '../dto/create-almacen.dto';
import { UpdateAlmacenDto } from '../dto/update-almacen.dto';

export const AlmacenesDocs = {
  create: {
    operation: { summary: 'Crear un nuevo almacén', description: 'Registra un nuevo almacén.' },
    body: { type: CreateAlmacenDto, description: 'Datos requeridos para crear un almacén' },
    response: [
      { status: 201, description: 'Almacén creado exitosamente' },
      { status: 401, description: 'No autenticado' },
      { status: 403, description: 'No autorizado' },
    ],
  },
  findAll: {
    operation: { summary: 'Obtener todos los almacenes', description: 'Lista completa de almacenes' },
    response: [
      { status: 200, description: 'Lista obtenida' },
      { status: 401, description: 'No autenticado' },
      { status: 403, description: 'No autorizado' },
    ],
  },
  findOne: {
    operation: { summary: 'Obtener un almacén por ID', description: 'Detalles de un almacén específico' },
    response: [
      { status: 200, description: 'Almacén encontrado' },
      { status: 401, description: 'No autenticado' },
      { status: 403, description: 'No autorizado' },
      { status: 404, description: 'No encontrado' },
    ],
  },
  update: {
    operation: { summary: 'Actualizar un almacén', description: 'Modifica los detalles de un almacén' },
    body: { type: UpdateAlmacenDto, description: 'Datos para actualizar el almacén' },
    response: [
      { status: 200, description: 'Almacén actualizado exitosamente' },
      { status: 401, description: 'No autenticado' },
      { status: 403, description: 'No autorizado' },
      { status: 404, description: 'No encontrado' },
    ],
  },
  remove: {
    operation: { summary: 'Eliminar un almacén', description: 'Elimina un almacén' },
    response: [
      { status: 200, description: 'Almacén eliminado exitosamente' },
      { status: 401, description: 'No autenticado' },
      { status: 403, description: 'No autorizado' },
      { status: 404, description: 'No encontrado' },
    ],
  },
  restore: {
    operation: { summary: 'Restaurar un almacén eliminado', description: 'Restaura un almacén previamente eliminado' },
    response: [
      { status: 200, description: 'Almacén restaurado exitosamente' },
      { status: 401, description: 'No autenticado' },
      { status: 403, description: 'No autorizado' },
      { status: 404, description: 'No encontrado' },
    ],
  },
};
