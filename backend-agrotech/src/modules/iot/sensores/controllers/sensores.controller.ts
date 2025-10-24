// src/modules/iot/sensores/sensores.controller.ts
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
  BadRequestException,
} from '@nestjs/common';
import { SensoresService } from '../services/sensores.service';
import { CreateSensorDto } from '../dto/create-sensor.dto';
import { UpdateSensorDto } from '../dto/update-sensor.dto';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { SensoresGateway } from '../gateways/sensor.gateway';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { SensoresDocs } from '../docs/sensores.docs';

@ApiTags('Sensores')
@ApiBearerAuth('access-token')
@Controller('sensores')
export class SensoresController {
  constructor(
    private readonly sensoresService: SensoresService,
    private readonly sensoresGateway: SensoresGateway,
  ) {}

  // =========================
  // Crear sensor
  // =========================
  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:sensores:create')
  @ApiOperation({ summary: SensoresDocs.create.summary, description: SensoresDocs.create.description })
  @ApiBody({ type: CreateSensorDto })
  @ApiResponse(SensoresDocs.create.response)
  async create(@Body() dto: CreateSensorDto) {
    const sensor = await this.sensoresService.create(dto);
    this.sensoresGateway.server.emit('sensores:created', sensor);
    return sensor;
  }

  // =========================
  // Obtener todos los sensores
  // =========================
  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:sensores:read')
  @ApiOperation({ summary: SensoresDocs.findAll.summary, description: SensoresDocs.findAll.description })
  @ApiResponse(SensoresDocs.findAll.response)
  findAll() {
    return this.sensoresService.findAll();
  }

  // =========================
  // Obtener sensores eliminados
  // =========================
  @Get('deleted')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:sensores:read')
  @ApiOperation({ summary: SensoresDocs.findAllDeleted.summary, description: SensoresDocs.findAllDeleted.description })
  @ApiResponse(SensoresDocs.findAllDeleted.response)
  findAllDeleted() {
    return this.sensoresService.findAllDeleted();
  }

  // =========================
  // Obtener un sensor por ID
  // =========================
  @Get(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:sensores:read')
  @ApiOperation({ summary: SensoresDocs.findOne.summary, description: SensoresDocs.findOne.description })
  @ApiParam({ name: 'id', description: SensoresDocs.findOne.params.id })
  @ApiResponse(SensoresDocs.findOne.response)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sensoresService.findOne(id);
  }

  // =========================
  // Actualizar sensor
  // =========================
  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:sensores:update')
  @ApiOperation({ summary: SensoresDocs.update.summary, description: SensoresDocs.update.description })
  @ApiParam({ name: 'id', description: SensoresDocs.update.params.id })
  @ApiBody({ type: UpdateSensorDto })
  @ApiResponse(SensoresDocs.update.response)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSensorDto,
  ) {
    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException('Se requiere al menos un campo para actualizar');
    }

    const updated = await this.sensoresService.update(id, dto);
    this.sensoresGateway.server.emit('sensores:updated', updated);
    return updated;
  }

  // =========================
  // Eliminar sensor
  // =========================
  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:sensores:delete')
  @ApiOperation({ summary: SensoresDocs.remove.summary, description: SensoresDocs.remove.description })
  @ApiParam({ name: 'id', description: SensoresDocs.remove.params.id })
  @ApiResponse(SensoresDocs.remove.response)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.sensoresService.remove(id);
    this.sensoresGateway.server.emit('sensores:removed', { id });
    return { message: 'Sensor eliminado', id };
  }

  // =========================
  // Restaurar sensor
  // =========================
  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:sensores:update')
  @ApiOperation({ summary: SensoresDocs.restore.summary, description: SensoresDocs.restore.description })
  @ApiParam({ name: 'id', description: SensoresDocs.restore.params.id })
  @ApiResponse(SensoresDocs.restore.response)
  async restore(@Param('id', ParseIntPipe) id: number) {
    const restored = await this.sensoresService.restore(id);
    this.sensoresGateway.server.emit('sensores:restored', restored);
    return restored;
  }


  // =========================
// Obtener historial de lecturas de un sensor
// =========================
@Get(':id/historial')
@UseGuards(JwtAuthGuard, PermisosGuard)
@PermisoRequerido('iot:sensores:read')
@ApiOperation({
  summary: 'Obtener historial de lecturas',
  description: 'Devuelve las últimas lecturas registradas del sensor especificado.',
})
@ApiParam({ name: 'id', description: 'ID del sensor' })
@ApiResponse({
  status: 200,
  description: 'Historial de lecturas obtenido correctamente',
  schema: {
    example: [
      { id_lectura_pk: 1, valor: 23.5, fecha: '2025-10-24T00:30:00Z' },
      { id_lectura_pk: 2, valor: 24.1, fecha: '2025-10-24T00:35:00Z' },
    ],
  },
})
async findHistorial(@Param('id', ParseIntPipe) id: number) {
  const historial = await this.sensoresService.findHistorial(id);
  return historial;
}

}
