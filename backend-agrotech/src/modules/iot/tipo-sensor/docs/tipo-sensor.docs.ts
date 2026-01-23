import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { CreateTipoSensorDto } from '../dto/create-tipo-sensor.dto';
import { UpdateTipoSensorDto } from '../dto/update-tipo-sensor.dto';

/**
 *  Esquema base de un TipoSensor para Swagger
 */
export const TipoSensorSchema = {
  type: 'object',
  properties: {
    id_tipo_sensor_pk: { type: 'integer', example: 1 },
    nombre_tipo_sensor_fk: { type: 'string', example: 'Temperatura' },
    unidades_tipo_sensor: { type: 'string', example: '°C' },
    decimales_tipo_sensor: { type: 'integer', example: 2 },
    imagen_tipo_sensor: {
      type: 'string',
      example: 'https://cdn.sensores.com/temp_icon.png',
    },
    created_at: { type: 'string', example: '2025-10-22T15:30:00Z' },
    updated_at: { type: 'string', example: '2025-10-22T15:35:00Z' },
    deleted_at: { type: 'string', nullable: true, example: null },
  },
};

/**
 *  Ejemplo de creación de tipo de sensor
 */
export const ExampleCreateTipoSensor = {
  nombre_tipo_sensor_fk: 'Humedad',
  unidades_tipo_sensor: '%',
  decimales_tipo_sensor: 1,
  imagen_tipo_sensor: 'https://cdn.sensores.com/humedad_icon.png',
};

/**
 *  Ejemplo de actualización de tipo de sensor
 */
export const ExampleUpdateTipoSensor = {
  unidades_tipo_sensor: 'ppm',
  decimales_tipo_sensor: 3,
};

/**
 *  Decoradores reutilizables de documentación Swagger para TipoSensorController
 */
export const TipoSensorDocs = {
  /** Controlador principal */
  Controller: () =>
    applyDecorators(
      ApiTags('IoT - Tipo de Sensor'),
      ApiBearerAuth('access-token'),
      ApiExtraModels(CreateTipoSensorDto, UpdateTipoSensorDto),
      ApiResponse({
        status: 401,
        description: 'No autenticado. Token JWT ausente o inválido.',
      }),
      ApiResponse({
        status: 403,
        description: 'No autorizado. El usuario no tiene permisos suficientes.',
      }),
    ),

  /** CREAR */
  Create: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Crear un nuevo tipo de sensor',
        description:
          'Permite registrar un tipo de sensor con su nombre, unidades, decimales e imagen asociada.',
      }),
      ApiBody({
        schema: {
          type: 'object',
          example: ExampleCreateTipoSensor,
        },
      }),
      ApiResponse({
        status: 201,
        description: 'Tipo de sensor creado exitosamente.',
        schema: {
          allOf: [{ $ref: getSchemaPath(CreateTipoSensorDto) }],
        },
      }),
      ApiResponse({ status: 400, description: 'Datos inválidos en la solicitud.' }),
    ),

  /** LISTAR ACTIVOS */
  FindAll: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Listar tipos de sensor activos',
        description:
          'Devuelve todos los tipos de sensor que no han sido eliminados (soft delete).',
      }),
      ApiResponse({
        status: 200,
        description: 'Lista de tipos de sensor activos.',
        schema: {
          type: 'array',
          items: TipoSensorSchema,
        },
      }),
    ),

  /** LISTAR ELIMINADOS */
  FindAllDeleted: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Listar tipos de sensor eliminados',
        description: 'Devuelve todos los tipos de sensor marcados como eliminados.',
      }),
      ApiResponse({
        status: 200,
        description: 'Lista de tipos de sensor eliminados.',
        schema: {
          type: 'array',
          items: TipoSensorSchema,
        },
      }),
    ),

  /** OBTENER POR ID */
  FindOne: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Obtener tipo de sensor por ID',
        description:
          'Devuelve la información detallada de un tipo de sensor según su identificador único.',
      }),
      ApiResponse({
        status: 200,
        description: 'Tipo de sensor encontrado.',
        schema: TipoSensorSchema,
      }),
      ApiResponse({
        status: 404,
        description: 'Tipo de sensor no encontrado.',
      }),
    ),

  /** ACTUALIZAR */
  Update: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Actualizar un tipo de sensor existente',
        description:
          'Permite modificar las unidades, decimales o imagen de un tipo de sensor.',
      }),
      ApiBody({
        schema: {
          type: 'object',
          example: ExampleUpdateTipoSensor,
        },
      }),
      ApiResponse({
        status: 200,
        description: 'Tipo de sensor actualizado correctamente.',
        schema: TipoSensorSchema,
      }),
      ApiResponse({
        status: 404,
        description: 'Tipo de sensor no encontrado.',
      }),
    ),

  /** ELIMINAR */
  Remove: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Eliminar un tipo de sensor (soft delete)',
        description:
          'Marca el tipo de sensor como eliminado sin borrarlo físicamente de la base de datos.',
      }),
      ApiResponse({
        status: 200,
        description: 'Tipo de sensor eliminado correctamente.',
      }),
      ApiResponse({
        status: 404,
        description: 'Tipo de sensor no encontrado.',
      }),
    ),

  /** RESTAURAR */
  Restore: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Restaurar un tipo de sensor eliminado',
        description:
          'Permite recuperar un tipo de sensor previamente eliminado mediante soft delete.',
      }),
      ApiResponse({
        status: 200,
        description: 'Tipo de sensor restaurado correctamente.',
      }),
      ApiResponse({
        status: 404,
        description: 'Tipo de sensor no encontrado.',
      }),
    ),
};
