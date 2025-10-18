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
import { TipoSensorService } from '../services/tipo-sensor.service';
import { CreateTipoSensorDto } from '../dto/create-tipo-sensor.dto';
import { UpdateTipoSensorDto } from '../dto/update-tipo-sensor.dto';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { TipoSensorGateway } from '../gateways/tipo-sensor.gateway';

@ApiTags('Tipo-Sensor')
@ApiBearerAuth('access-token')
@Controller('tipo-sensor')
export class TipoSensorController {
  constructor(
    private readonly tipoSensorService: TipoSensorService,
    private readonly tipoSensorGateway: TipoSensorGateway,
  ) {}

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
    schema: { example: { id_tipo_sensor_pk: 1, nombre_tipo_sensor: 'Humedad' } },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiBody({
    type: CreateTipoSensorDto,
    description: 'Datos requeridos para crear un tipo de sensor',
    examples: {
      valido: { value: { nombre_tipo_sensor: 'Humedad' }, summary: 'Ejemplo válido' },
      invalido: { value: { nombre_tipo_sensor: '' }, summary: 'Ejemplo inválido' },
    },
  })
  async create(@Body() dto: CreateTipoSensorDto) {
    const result = await this.tipoSensorService.create(dto);
    this.tipoSensorGateway.notifyChanges();
    return result;
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:tipo-sensor:read')
  @ApiOperation({
    summary: 'Obtener todos los tipos de sensor activos',
    description: 'Devuelve la lista completa de tipos de sensor activos. Requiere el permiso "iot:tipo-sensor:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de sensor obtenida exitosamente',
    schema: { 
      example: [ 
        { id_tipo_sensor_pk: 1, nombre_tipo_sensor: 'Humedad' },
        { id_tipo_sensor_pk: 2, nombre_tipo_sensor: 'Temperatura' },
      ] 
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  findAll() {
    return this.tipoSensorService.findAll();
  }

  @Get('deleted')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:tipo-sensor:read')
  @ApiOperation({
    summary: 'Obtener todos los tipos de sensor eliminados',
    description: 'Devuelve la lista de tipos de sensor que han sido eliminados. Requiere "iot:tipo-sensor:read".',
  })
  @ApiResponse({ status: 200, description: 'Lista de eliminados obtenida exitosamente.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  findAllDeleted() {
    return this.tipoSensorService.findAllDeleted();
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
    schema: { example: { id_tipo_sensor_pk: 1, nombre_tipo_sensor: 'Humedad' } },
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
    schema: { example: { id_tipo_sensor_pk: 1, nombre_tipo_sensor: 'Humedad Mejorada' } },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Tipo de sensor no encontrado' })
  @ApiBody({
    type: UpdateTipoSensorDto,
    description: 'Datos para actualizar el tipo de sensor (campos opcionales)',
    examples: {
      valido: { value: { nombre_tipo_sensor: 'Humedad Mejorada' }, summary: 'Ejemplo válido' },
      invalido: { value: { nombre_tipo_sensor: '' }, summary: 'Ejemplo inválido' },
    },
  })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTipoSensorDto) {
    const result = await this.tipoSensorService.update(id, dto);
    this.tipoSensorGateway.notifyChanges();
    return result;
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
    schema: { example: { message: 'Tipo de sensor con ID 1 eliminado correctamente' } },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Tipo de sensor no encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.tipoSensorService.remove(id);
    this.tipoSensorGateway.notifyChanges();
    return result;
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
    schema: { example: { message: 'Tipo de sensor con ID 1 restaurado correctamente' } },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Tipo de sensor no encontrado' })
  async restore(@Param('id', ParseIntPipe) id: number) {
    const result = await this.tipoSensorService.restore(id);
    this.tipoSensorGateway.notifyChanges();
    return result;
  }
}