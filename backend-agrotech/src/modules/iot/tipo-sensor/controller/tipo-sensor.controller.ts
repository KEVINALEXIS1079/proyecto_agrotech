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
import { TipoSensorService } from '../service/tipo-sensor.service';
import { CreateTipoSensorDto } from '../dto/create-tipo-sensor.dto';
import { UpdateTipoSensorDto } from '../dto/update-tipo-sensor.dto';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Tipo-Sensor') // Agrupa los endpoints bajo "Tipo-Sensor"
@ApiBearerAuth('access-token') // Indica que se requiere autenticación JWT
@Controller('tipo-sensor')
export class TipoSensorController {
  constructor(private readonly tipoSensorService: TipoSensorService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:tipo-sensor:create')
  @ApiOperation({
    summary: 'Crear un nuevo tipo de sensor',
    description: 'Registra un nuevo tipo de sensor en el sistema. Requiere el permiso "iot:tipo-sensor:create".',
  })
  @ApiResponse({
    status: 201,
    description: 'Tipo de sensor creado exitosamente',
    schema: {
      example: {
        id_tipo_sensor_pk: 1,
        nombre_tipo_sensor: 'Humedad',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiBody({
    type: CreateTipoSensorDto,
    description: 'Datos requeridos para crear un tipo de sensor',
    examples: {
      valido: {
        value: {
          nombre_tipo_sensor: 'Humedad',
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          nombre_tipo_sensor: '', // Valor inválido (vacío)
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  create(@Body() dto: CreateTipoSensorDto) {
    return this.tipoSensorService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:tipo-sensor:read')
  @ApiOperation({
    summary: 'Obtener todos los tipos de sensor',
    description: 'Devuelve la lista completa de tipos de sensor. Requiere el permiso "iot:tipo-sensor:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de sensor obtenida exitosamente',
    schema: {
      example: [
        {
          id_tipo_sensor_pk: 1,
          nombre_tipo_sensor: 'Humedad',
        },
        {
          id_tipo_sensor_pk: 2,
          nombre_tipo_sensor: 'Temperatura',
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  findAll() {
    return this.tipoSensorService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:tipo-sensor:read')
  @ApiOperation({
    summary: 'Obtener un tipo de sensor por ID',
    description: 'Devuelve los detalles de un tipo de sensor específico según su ID. Requiere el permiso "iot:tipo-sensor:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de sensor encontrado',
    schema: {
      example: {
        id_tipo_sensor_pk: 1,
        nombre_tipo_sensor: 'Humedad',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Tipo de sensor no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tipoSensorService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:tipo-sensor:update')
  @ApiOperation({
    summary: 'Actualizar un tipo de sensor',
    description: 'Modifica los detalles de un tipo de sensor existente. Requiere el permiso "iot:tipo-sensor:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de sensor actualizado exitosamente',
    schema: {
      example: {
        id_tipo_sensor_pk: 1,
        nombre_tipo_sensor: 'Humedad Mejorada',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Tipo de sensor no encontrado' })
  @ApiBody({
    type: UpdateTipoSensorDto,
    description: 'Datos para actualizar el tipo de sensor (campos opcionales)',
    examples: {
      valido: {
        value: {
          nombre_tipo_sensor: 'Humedad Mejorada',
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          nombre_tipo_sensor: '', // Valor inválido (vacío)
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTipoSensorDto) {
    return this.tipoSensorService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:tipo-sensor:delete')
  @ApiOperation({
    summary: 'Eliminar un tipo de sensor',
    description: 'Elimina un tipo de sensor del sistema. Requiere el permiso "iot:tipo-sensor:delete".',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de sensor eliminado exitosamente',
    schema: {
      example: { message: 'Tipo de sensor con ID 1 eliminado correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Tipo de sensor no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tipoSensorService.remove(id);
  }

  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:tipo-sensor:update')
  @ApiOperation({
    summary: 'Restaurar un tipo de sensor eliminado',
    description: 'Restaura un tipo de sensor previamente eliminado. Requiere el permiso "iot:tipo-sensor:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de sensor restaurado exitosamente',
    schema: {
      example: { message: 'Tipo de sensor con ID 1 restaurado correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Tipo de sensor no encontrado' })
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.tipoSensorService.restore(id);
  }
}