import { CreateMovimientoInsumoDto } from '../dto/create-movimiento-insumo.dto';
import { UpdateMovimientoInsumoDto } from '../dto/update-movimiento-insumo.dto';

export const MovimientoInsumoDocs = {
  create: {
    operation: { summary: 'Crear un nuevo movimiento de insumo' },
    response: [
      { status: 201, description: 'Movimiento de insumo creado exitosamente', schema: { $ref: '#/components/schemas/CreateMovimientoInsumoDto' }, example: {
        id_movimiento_insumo_pk: 1,
        tipo_movimiento: 'entrada',
        cantidad: 50,
        fecha_movimiento: '2025-09-22T10:30:00Z',
        motivo: 'Compra de insumos',
        id_insumo_fk: 1,
        id_almacen_fk: 1,
        id_usuario_fk: 1,
      }},
      { status: 400, description: 'Datos inválidos' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
    body: { type: CreateMovimientoInsumoDto, example: {
      tipo_movimiento: 'entrada',
      cantidad: 50,
      fecha_movimiento: '2025-09-22T10:30:00Z',
      motivo: 'Compra de insumos',
      id_insumo_fk: 1,
      id_almacen_fk: 1,
      id_usuario_fk: 1,
    } },
  },

  findAll: {
    operation: { summary: 'Obtener todos los movimientos de insumo' },
    response: [
      { status: 200, description: 'Listado de movimientos obtenido', example: [
        {
          id_movimiento_insumo_pk: 1,
          tipo_movimiento: 'entrada',
          cantidad: 50,
          fecha_movimiento: '2025-09-22T10:30:00Z',
          motivo: 'Compra de insumos',
          id_insumo_fk: 1,
          id_almacen_fk: 1,
          id_usuario_fk: 1,
        },
        {
          id_movimiento_insumo_pk: 2,
          tipo_movimiento: 'salida',
          cantidad: 10,
          fecha_movimiento: '2025-09-23T14:20:00Z',
          motivo: 'Uso en producción',
          id_insumo_fk: 1,
          id_almacen_fk: 1,
          id_usuario_fk: 2,
        }
      ] },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },

  findOne: {
    operation: { summary: 'Obtener un movimiento de insumo por ID' },
    response: [
      { status: 200, description: 'Movimiento de insumo obtenido', example: {
        id_movimiento_insumo_pk: 1,
        tipo_movimiento: 'entrada',
        cantidad: 50,
        fecha_movimiento: '2025-09-22T10:30:00Z',
        motivo: 'Compra de insumos',
        id_insumo_fk: 1,
        id_almacen_fk: 1,
        id_usuario_fk: 1,
      }},
      { status: 404, description: 'Movimiento de insumo no encontrado' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },

  update: {
    operation: { summary: 'Actualizar un movimiento de insumo existente' },
    response: [
      { status: 200, description: 'Movimiento de insumo actualizado exitosamente', example: {
        id_movimiento_insumo_pk: 1,
        tipo_movimiento: 'entrada',
        cantidad: 60,
        fecha_movimiento: '2025-09-22T10:30:00Z',
        motivo: 'Compra de insumos - ajuste',
        id_insumo_fk: 1,
        id_almacen_fk: 1,
        id_usuario_fk: 1,
      }},
      { status: 400, description: 'Datos inválidos' },
      { status: 404, description: 'Movimiento de insumo no encontrado' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
    body: { type: UpdateMovimientoInsumoDto, example: {
      cantidad: 60,
      motivo: 'Compra de insumos - ajuste',
    } },
  },

  remove: {
    operation: { summary: 'Eliminar un movimiento de insumo' },
    response: [
      { status: 200, description: 'Movimiento de insumo eliminado correctamente', example: { id_movimiento_insumo_pk: 1 } },
      { status: 404, description: 'Movimiento de insumo no encontrado' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },

  restore: {
    operation: { summary: 'Restaurar un movimiento de insumo eliminado' },
    response: [
      { status: 200, description: 'Movimiento de insumo restaurado correctamente', example: {
        id_movimiento_insumo_pk: 1,
        tipo_movimiento: 'entrada',
        cantidad: 50,
        fecha_movimiento: '2025-09-22T10:30:00Z',
        motivo: 'Compra de insumos',
        id_insumo_fk: 1,
        id_almacen_fk: 1,
        id_usuario_fk: 1,
      }},
      { status: 404, description: 'Movimiento de insumo no encontrado' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },
};