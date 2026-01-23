import { CreateEpaDto } from '../dto/create-epa.dto';
import { UpdateEpaDto } from '../dto/update-epa.dto';

export const EpasDocs = {
  create: {
    operation: { summary: 'Crear un nuevo EPA', description: 'Registra un nuevo EPA en el sistema.' },
    body: {
      type: CreateEpaDto,
      example: {
        nombre_epa: 'Sigatoga negra',
        descripcion_epa: 'Sigatoga negra encontrada en el cacao',
        estado: 'presente',
        id_tipo_epa_fk: 1,
        id_cultivo_fk: 2,
      },
    },
    response: [
      {
        status: 201,
        description: 'EPA creado exitosamente',
        example: {
          id_epa_pk: 1,
          nombre_epa: 'Sigatoga negra',
          descripcion_epa: 'Sigatoga negra encontrada en el cacao',
          estado: 'presente',
          id_tipo_epa_fk: 1,
          id_cultivo_fk: 2,
        },
      },
      { status: 400, description: 'Datos inválidos' },
      { status: 401, description: 'No autenticado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },

  findAll: {
    operation: { summary: 'Obtener todos los EPAs' },
    response: [
      {
        status: 200,
        description: 'Lista de EPAs obtenida',
        example: [
          {
            id_epa_pk: 1,
            nombre_epa: 'Sigatoga negra',
            descripcion_epa: 'Sigatoga negra encontrada en el cacao',
            estado: 'presente',
            id_tipo_epa_fk: 1,
            id_cultivo_fk: 2,
          },
          {
            id_epa_pk: 2,
            nombre_epa: 'Mancha anaranjada',
            descripcion_epa: 'Mancha anaranjada en café',
            estado: 'ausente',
            id_tipo_epa_fk: 2,
            id_cultivo_fk: 3,
          },
        ],
      },
      { status: 401, description: 'No autenticado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },

  findOne: {
    operation: { summary: 'Obtener un EPA por ID' },
    response: [
      {
        status: 200,
        description: 'EPA encontrado',
        example: {
          id_epa_pk: 1,
          nombre_epa: 'Sigatoga negra',
          descripcion_epa: 'Sigatoga negra encontrada en el cacao',
          estado: 'presente',
          id_tipo_epa_fk: 1,
          id_cultivo_fk: 2,
        },
      },
      { status: 404, description: 'EPA no encontrado' },
      { status: 401, description: 'No autenticado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },

  update: {
    operation: { summary: 'Actualizar un EPA' },
    body: {
      type: UpdateEpaDto,
      example: {
        nombre_epa: 'Sigatoga negra actualizada',
        descripcion_epa: 'Nivel moderado en el cacao',
      },
    },
    response: [
      {
        status: 200,
        description: 'EPA actualizado exitosamente',
        example: {
          id_epa_pk: 1,
          nombre_epa: 'Sigatoga negra actualizada',
          descripcion_epa: 'Nivel moderado en el cacao',
          estado: 'presente',
          id_tipo_epa_fk: 1,
          id_cultivo_fk: 2,
        },
      },
      { status: 400, description: 'Datos inválidos' },
      { status: 404, description: 'EPA no encontrado' },
      { status: 401, description: 'No autenticado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },

  remove: {
    operation: { summary: 'Eliminar un EPA' },
    response: [
      {
        status: 200,
        description: 'EPA eliminado correctamente',
        example: { message: 'EPA con ID 1 eliminado correctamente' },
      },
      { status: 404, description: 'EPA no encontrado' },
      { status: 401, description: 'No autenticado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },

  restore: {
    operation: { summary: 'Restaurar un EPA eliminado' },
    response: [
      {
        status: 200,
        description: 'EPA restaurado correctamente',
        example: { message: 'EPA con ID 1 restaurado correctamente' },
      },
      { status: 404, description: 'EPA no encontrado' },
      { status: 401, description: 'No autenticado' },
      { status: 403, description: 'Permiso denegado' },
    ],
  },
};
