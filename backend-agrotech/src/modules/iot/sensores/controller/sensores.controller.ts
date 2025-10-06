import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { SensoresService } from '../service/sensores.service';
import { CreateSensorDto } from '../dto/create-sensor.dto';
import { UpdateSensorDto } from '../dto/update-sensor.dto';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Sensores') // Agrupa los endpoints bajo "Sensores"
@ApiBearerAuth('access-token') // Indica que se requiere autenticación JWT
@Controller('sensores')
export class SensoresController {
  constructor(private readonly sensoresService: SensoresService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:sensores:create')
  @ApiOperation({
    summary: 'Crear un nuevo sensor',
    description: 'Registra un nuevo sensor en el sistema. Requiere el permiso "iot:sensores:create".',
  })
  @ApiResponse({
    status: 201,
    description: 'Sensor creado exitosamente',
    schema: {
      example: {
        id_sensor_pk: 1,
        nombre_sensor: 'Sensor de humedad',
        valor_minimo: 20,
        valor_maximo: 80,
        fecha_inicio_sensor: '2025-09-22',
        fecha_fin_sensor: '2026-09-22',
        id_cultivo_fk: 1,
        id_tipo_sensor_fk: 2,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiBody({
    type: CreateSensorDto,
    description: 'Datos requeridos para crear un sensor',
    examples: {
      valido: {
        value: {
          nombre_sensor: 'Sensor de humedad',
          valor_minimo: 20,
          valor_maximo: 80,
          fecha_inicio_sensor: '2025-09-22',
          fecha_fin_sensor: '2026-09-22',
          id_cultivo_fk: 1,
          id_tipo_sensor_fk: 2,
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          nombre_sensor: 123, // Valor inválido (no texto)
          valor_minimo: '20', // Valor inválido (no entero)
          valor_maximo: -10, // Valor inválido (negativo)
          fecha_inicio_sensor: '2025-13-45', // Fecha inválida
          fecha_fin_sensor: '2025-01-01', // Antes de fecha inicio
          id_cultivo_fk: 0, // Valor inválido (no positivo)
          id_tipo_sensor_fk: -1, // Valor inválido (negativo)
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  create(@Body() dto: CreateSensorDto) {
    return this.sensoresService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:sensores:read')
  @ApiOperation({
    summary: 'Obtener todos los sensores',
    description: 'Devuelve la lista completa de sensores. Requiere el permiso "iot:sensores:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de sensores obtenida exitosamente',
    schema: {
      example: [
        {
          id_sensor_pk: 1,
          nombre_sensor: 'Sensor de humedad',
          valor_minimo: 20,
          valor_maximo: 80,
          fecha_inicio_sensor: '2025-09-22',
          fecha_fin_sensor: '2026-09-22',
          id_cultivo_fk: 1,
          id_tipo_sensor_fk: 2,
        },
        {
          id_sensor_pk: 2,
          nombre_sensor: 'Sensor de temperatura',
          valor_minimo: 10,
          valor_maximo: 40,
          fecha_inicio_sensor: '2025-09-21',
          fecha_fin_sensor: '2026-09-21',
          id_cultivo_fk: 5,
          id_tipo_sensor_fk: 3,
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  findAll() {
    return this.sensoresService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:sensores:read')
  @ApiOperation({
    summary: 'Obtener un sensor por ID',
    description: 'Devuelve los detalles de un sensor específico según su ID. Requiere el permiso "iot:sensores:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Sensor encontrado',
    schema: {
      example: {
        id_sensor_pk: 1,
        nombre_sensor: 'Sensor de humedad',
        valor_minimo: 20,
        valor_maximo: 80,
        fecha_inicio_sensor: '2025-09-22',
        fecha_fin_sensor: '2026-09-22',
        id_cultivo_fk: 1,
        id_tipo_sensor_fk: 2,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Sensor no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sensoresService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:sensores:update')
  @ApiOperation({
    summary: 'Actualizar un sensor',
    description: 'Modifica los detalles de un sensor existente. Requiere el permiso "iot:sensores:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Sensor actualizado exitosamente',
    schema: {
      example: {
        id_sensor_pk: 1,
        nombre_sensor: 'Sensor de humedad mejorado',
        valor_minimo: 15,
        valor_maximo: 85,
        fecha_inicio_sensor: '2025-09-22',
        fecha_fin_sensor: '2026-09-22',
        id_cultivo_fk: 1,
        id_tipo_sensor_fk: 2,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Sensor no encontrado' })
  @ApiBody({
    type: UpdateSensorDto,
    description: 'Datos para actualizar el sensor (campos opcionales)',
    examples: {
      valido: {
        value: {
          nombre_sensor: 'Sensor de humedad mejorado',
          valor_minimo: 15,
          valor_maximo: 85,
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          nombre_sensor: 123, // Valor inválido (no texto)
          valor_minimo: '15', // Valor inválido (no entero)
          valor_maximo: -10, // Valor inválido (negativo)
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSensorDto) {
    return this.sensoresService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:sensores:delete')
  @ApiOperation({
    summary: 'Eliminar un sensor',
    description: 'Elimina un sensor del sistema. Requiere el permiso "iot:sensores:delete".',
  })
  @ApiResponse({
    status: 200,
    description: 'Sensor eliminado exitosamente',
    schema: {
      example: { message: 'Sensor con ID 1 eliminado correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Sensor no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sensoresService.remove(id);
  }

  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:sensores:update')
  @ApiOperation({
    summary: 'Restaurar un sensor eliminado',
    description: 'Restaura un sensor previamente eliminado. Requiere el permiso "iot:sensores:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Sensor restaurado exitosamente',
    schema: {
      example: { message: 'Sensor con ID 1 restaurado correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Sensor no encontrado' })
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.sensoresService.restore(id);
  }
}