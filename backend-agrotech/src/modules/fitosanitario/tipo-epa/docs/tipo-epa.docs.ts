import { CreateTipoEpaDto } from '../dto/create-tipo-epa.dto';
import { UpdateTipoEpaDto } from '../dto/update-tipo-epa.dto';

export const TipoEpaDocs = {
  create: {
    operation: { summary: 'Crear un nuevo tipo de EPA' },
    response: [
      { status: 201, description: 'Tipo de EPA creado exitosamente', schema: { $ref: '#/components/schemas/CreateTipoEpaDto' }, example: {
        id_tipo_epa_pk: 1,
        nombre_tipo_epa: 'Gusano Cogollero',
        descripcion: 'Plaga que afecta las hojas del cultivo de cacao',
        tipo_epa_enum: 'plaga',
      }},
      { status: 400, description: 'Datos inválidos' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
    body: { type: CreateTipoEpaDto, example: {
      nombre_tipo_epa: 'Gusano Cogollero',
      descripcion: 'Plaga que afecta las hojas del cultivo de cacao',
      tipo_epa_enum: 'plaga',
    } },
  },

  findAll: {
    operation: { summary: 'Obtener todos los tipos de EPA' },
    response: [
      { status: 200, description: 'Listado de tipos de EPA obtenido', example: [
        {
          id_tipo_epa_pk: 1,
          nombre_tipo_epa: 'Gusano Cogollero',
          descripcion: 'Plaga que afecta las hojas del cultivo de cacao',
          tipo_epa_enum: 'plaga',
        },
        {
          id_tipo_epa_pk: 2,
          nombre_tipo_epa: 'Mancha de oídio',
          descripcion: 'Enfermedad que afecta los frutos del café',
          tipo_epa_enum: 'enfermedad',
        }
      ] },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },

  findOne: {
    operation: { summary: 'Obtener un tipo de EPA por ID' },
    response: [
      { status: 200, description: 'Tipo de EPA obtenido', example: {
        id_tipo_epa_pk: 1,
        nombre_tipo_epa: 'Gusano Cogollero',
        descripcion: 'Plaga que afecta las hojas del cultivo de cacao',
        tipo_epa_enum: 'plaga',
      }},
      { status: 404, description: 'Tipo de EPA no encontrado' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },

  update: {
    operation: { summary: 'Actualizar un tipo de EPA existente' },
    response: [
      { status: 200, description: 'Tipo de EPA actualizado exitosamente', example: {
        id_tipo_epa_pk: 1,
        nombre_tipo_epa: 'Gusano Cogollero Actualizado',
        descripcion: 'Plaga que afecta las hojas del cultivo de cacao, nivel alto',
        tipo_epa_enum: 'plaga',
      }},
      { status: 400, description: 'Datos inválidos' },
      { status: 404, description: 'Tipo de EPA no encontrado' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
    body: { type: UpdateTipoEpaDto, example: {
      nombre_tipo_epa: 'Gusano Cogollero Actualizado',
      descripcion: 'Plaga que afecta las hojas del cultivo de cacao, nivel alto',
      tipo_epa_enum: 'plaga',
    } },
  },

  remove: {
    operation: { summary: 'Eliminar un tipo de EPA' },
    response: [
      { status: 200, description: 'Tipo de EPA eliminado correctamente', example: { id_tipo_epa_pk: 1 } },
      { status: 404, description: 'Tipo de EPA no encontrado' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },

  restore: {
    operation: { summary: 'Restaurar un tipo de EPA eliminado' },
    response: [
      { status: 200, description: 'Tipo de EPA restaurado correctamente', example: {
        id_tipo_epa_pk: 1,
        nombre_tipo_epa: 'Gusano Cogollero',
        descripcion: 'Plaga que afecta las hojas del cultivo de cacao',
        tipo_epa_enum: 'plaga',
      }},
      { status: 404, description: 'Tipo de EPA no encontrado' },
      { status: 401, description: 'No autorizado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },
};