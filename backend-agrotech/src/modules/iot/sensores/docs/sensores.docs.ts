// src/modules/iot/sensores/docs/sensores.docs.ts
import { CreateSensorDto } from '../dto/create-sensor.dto';
import { UpdateSensorDto } from '../dto/update-sensor.dto';
import { Sensor } from '../entities/sensor.entity';

export const SensoresDocs = {
  create: {
    summary: 'Crear un nuevo sensor',
    description: 'Permite crear un sensor nuevo asociado a un lote y tipo de sensor.',
    body: CreateSensorDto,
    response: {
      status: 201,
      description: 'Sensor creado exitosamente',
      type: Sensor,
    },
  },

  findAll: {
    summary: 'Obtener todos los sensores',
    description: 'Devuelve la lista completa de sensores registrados en el sistema.',
    response: {
      status: 200,
      description: 'Lista de sensores',
      type: Sensor,
      isArray: true,
    },
  },

  findAllDeleted: {
    summary: 'Obtener sensores eliminados',
    description: 'Devuelve los sensores que han sido eliminados (soft delete).',
    response: {
      status: 200,
      description: 'Lista de sensores eliminados',
      type: Sensor,
      isArray: true,
    },
  },

  findOne: {
    summary: 'Obtener un sensor por ID',
    description: 'Devuelve la información de un sensor específico según su ID.',
    params: { id: 'ID del sensor' },
    response: {
      status: 200,
      description: 'Detalle del sensor',
      type: Sensor,
    },
  },

  update: {
    summary: 'Actualizar un sensor',
    description: 'Actualiza la información de un sensor existente. Se puede cambiar lote, tipo de sensor, broker, puerto, tópico y estado activo.',
    params: { id: 'ID del sensor a actualizar' },
    body: UpdateSensorDto,
    response: {
      status: 200,
      description: 'Sensor actualizado correctamente',
      type: Sensor,
    },
  },

  remove: {
    summary: 'Eliminar un sensor',
    description: 'Realiza un soft delete de un sensor y desconecta su MQTT si estaba activo.',
    params: { id: 'ID del sensor a eliminar' },
    response: {
      status: 200,
      description: 'Sensor eliminado correctamente',
      type: 'object',
      example: { id: 1, message: 'Sensor eliminado' },
    },
  },

  restore: {
    summary: 'Restaurar un sensor eliminado',
    description: 'Restaura un sensor previamente eliminado y reconecta su MQTT si está activo.',
    params: { id: 'ID del sensor a restaurar' },
    response: {
      status: 200,
      description: 'Sensor restaurado correctamente',
      type: Sensor,
    },
  },
};
