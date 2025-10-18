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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { SensoresService } from '../services/sensores.service';
import { CreateSensorDto } from '../dto/create-sensor.dto';
import { UpdateSensorDto } from '../dto/update-sensor.dto';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CustomFileInterceptor } from 'src/common/services/uploads/custom-file.interceptor';
import { SensoresGateway } from '../gateways/sensor.gateway';

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
  @UseInterceptors(CustomFileInterceptor.create('imagen_sensor', 'sensores'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateSensorDto,
  ) {
    if (file) {
      dto.imagen_sensor = file.path.replace(/\\/g, '/');
    }

    const sensor = await this.sensoresService.create(dto);
    // Emitir a todos los clientes conectados
    this.sensoresGateway.server.emit('sensores:created', sensor);
    return sensor;
  }

  // =========================
  // Obtener todos los sensores
  // =========================
  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:sensores:read')
  @ApiOperation({ summary: 'Obtener todos los sensores' })
  @ApiResponse({ status: 200, description: 'Lista de sensores' })
  findAll() {
    return this.sensoresService.findAll();
  }

  // =========================
  // Obtener sensores eliminados
  // =========================
  @Get('deleted')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:sensores:read')
  findAllDeleted() {
    return this.sensoresService.findAllDeleted();
  }

  // =========================
  // Obtener un sensor por ID
  // =========================
  @Get(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:sensores:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sensoresService.findOne(id);
  }

  // =========================
  // Actualizar sensor
  // =========================
  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:sensores:update')
  @UseInterceptors(CustomFileInterceptor.create('imagen_sensor', 'sensores'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateSensorDto,
  ) {
    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException('Se requiere al menos un campo para actualizar');
    }

    if (file) {
      dto.imagen_sensor = file.path.replace(/\\/g, '/');
    }

    const updated = await this.sensoresService.update(id, dto);
    // Emitir a todos los clientes conectados
    this.sensoresGateway.server.emit('sensores:updated', updated);
    return updated;
  }

  // =========================
  // Eliminar sensor
  // =========================
  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:sensores:delete')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.sensoresService.remove(id);
    // Emitir a todos los clientes conectados
    this.sensoresGateway.server.emit('sensores:removed', { id, message: result });
    return result;
  }

  // =========================
  // Restaurar sensor
  // =========================
  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:sensores:update')
  async restore(@Param('id', ParseIntPipe) id: number) {
    const result = await this.sensoresService.restore(id);
    // Emitir a todos los clientes conectados
    this.sensoresGateway.server.emit('sensores:restored', { id, message: result });
    return result;
  }
}
