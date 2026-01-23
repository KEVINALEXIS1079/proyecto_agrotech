import { CreateInsumoDto } from '../dto/create-insumo.dto';
import { UpdateInsumoDto } from '../dto/update-insumo.dto';

export const InsumosDocs = {
  create: {
    operation: { summary: 'Crear un nuevo insumo' },
    response: [
      { status: 201, description: 'Insumo creado exitosamente', schema: { $ref: '#/components/schemas/CreateInsumoDto' }, example: {
        id_insumo_pk: 1,
        costo: 1200.5,
        stock: 10,
        estado_insumo: 'A',
        unidad_medida: 'kg',
        fecha_ingreso: '2025-09-22',
        fecha_salida: null,
        fecha_vencimiento: '2026-01-01',
        id_almacen_fk: 1,
        id_categoria_fk: 2,
      }},
      { status: 400, description: 'Datos inválidos' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
    body: { type: CreateInsumoDto, example: {
      costo: 1200.5,
      stock: 10,
      estado_insumo: 'A',
      unidad_medida: 'kg',
      fecha_ingreso: '2025-09-22',
      fecha_salida: null,
      fecha_vencimiento: '2026-01-01',
      id_almacen_fk: 1,
      id_categoria_fk: 2,
    } },
  },

  findAll: {
    operation: { summary: 'Obtener todos los insumos' },
    response: [
      { status: 200, description: 'Listado de insumos obtenido', example: [
        {
          id_insumo_pk: 1,
          costo: 1200.5,
          stock: 10,
          estado_insumo: 'A',
          unidad_medida: 'kg',
          fecha_ingreso: '2025-09-22',
          fecha_salida: null,
          fecha_vencimiento: '2026-01-01',
          id_almacen_fk: 1,
          id_categoria_fk: 2,
        },
        {
          id_insumo_pk: 2,
          costo: 50000,
          stock: 200,
          estado_insumo: 'I',
          unidad_medida: 'litros',
          fecha_ingreso: '2025-09-21',
          fecha_salida: '2025-09-25',
          fecha_vencimiento: '2026-12-31',
          id_almacen_fk: 3,
          id_categoria_fk: 5,
        },
      ] },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },

  findOne: {
    operation: { summary: 'Obtener un insumo por ID' },
    response: [
      { status: 200, description: 'Insumo obtenido', example: {
        id_insumo_pk: 1,
        costo: 1200.5,
        stock: 10,
        estado_insumo: 'A',
        unidad_medida: 'kg',
        fecha_ingreso: '2025-09-22',
        fecha_salida: null,
        fecha_vencimiento: '2026-01-01',
        id_almacen_fk: 1,
        id_categoria_fk: 2,
      }},
      { status: 404, description: 'Insumo no encontrado' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },

  update: {
    operation: { summary: 'Actualizar un insumo existente' },
    response: [
      { status: 200, description: 'Insumo actualizado exitosamente', example: {
        id_insumo_pk: 1,
        costo: 1300.75,
        stock: 15,
        estado_insumo: 'A',
        unidad_medida: 'kg',
        fecha_ingreso: '2025-09-22',
        fecha_salida: null,
        fecha_vencimiento: '2026-01-01',
        id_almacen_fk: 1,
        id_categoria_fk: 2,
      }},
      { status: 400, description: 'Datos inválidos' },
      { status: 404, description: 'Insumo no encontrado' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
    body: { type: UpdateInsumoDto, example: {
      costo: 1300.75,
      stock: 15,
    } },
  },

  remove: {
    operation: { summary: 'Eliminar un insumo' },
    response: [
      { status: 200, description: 'Insumo eliminado correctamente', example: { id_insumo_pk: 1 } },
      { status: 404, description: 'Insumo no encontrado' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },

  restore: {
    operation: { summary: 'Restaurar un insumo eliminado' },
    response: [
      { status: 200, description: 'Insumo restaurado correctamente', example: {
        id_insumo_pk: 1,
        costo: 1200.5,
        stock: 10,
        estado_insumo: 'A',
        unidad_medida: 'kg',
        fecha_ingreso: '2025-09-22',
        fecha_salida: null,
        fecha_vencimiento: '2026-01-01',
        id_almacen_fk: 1,
        id_categoria_fk: 2,
      }},
      { status: 404, description: 'Insumo no encontrado' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },
};