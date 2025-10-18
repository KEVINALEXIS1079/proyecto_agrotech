import { CreateCategoriaDto } from '../dto/create-categoria.dto';
import { UpdateCategoriaDto } from '../dto/update-categoria.dto';

export const CategoriasDocs = {
  create: {
    operation: { summary: 'Crear una nueva categoría', description: 'Registra una nueva categoría en el sistema.' },
    body: { type: CreateCategoriaDto, description: 'Datos requeridos para crear una categoría' },
    response: [
      { status: 201, description: 'Categoría creada exitosamente' },
      { status: 401, description: 'No autenticado' },
      { status: 403, description: 'No autorizado' },
    ],
  },
  findAll: {
    operation: { summary: 'Obtener todas las categorías', description: 'Lista completa de categorías' },
    response: [
      { status: 200, description: 'Lista obtenida correctamente' },
      { status: 401, description: 'No autenticado' },
      { status: 403, description: 'No autorizado' },
    ],
  },
  findOne: {
    operation: { summary: 'Obtener una categoría por ID', description: 'Detalles de una categoría específica' },
    response: [
      { status: 200, description: 'Categoría encontrada' },
      { status: 401, description: 'No autenticado' },
      { status: 403, description: 'No autorizado' },
      { status: 404, description: 'No encontrada' },
    ],
  },
  update: {
    operation: { summary: 'Actualizar una categoría', description: 'Modifica los detalles de una categoría existente' },
    body: { type: UpdateCategoriaDto, description: 'Datos para actualizar la categoría' },
    response: [
      { status: 200, description: 'Categoría actualizada exitosamente' },
      { status: 401, description: 'No autenticado' },
      { status: 403, description: 'No autorizado' },
      { status: 404, description: 'No encontrada' },
    ],
  },
  remove: {
    operation: { summary: 'Eliminar una categoría', description: 'Elimina una categoría del sistema' },
    response: [
      { status: 200, description: 'Categoría eliminada exitosamente' },
      { status: 401, description: 'No autenticado' },
      { status: 403, description: 'No autorizado' },
      { status: 404, description: 'No encontrada' },
    ],
  },
  restore: {
    operation: { summary: 'Restaurar una categoría eliminada', description: 'Restaura una categoría previamente eliminada' },
    response: [
      { status: 200, description: 'Categoría restaurada exitosamente' },
      { status: 401, description: 'No autenticado' },
      { status: 403, description: 'No autorizado' },
      { status: 404, description: 'No encontrada' },
    ],
  },
};
