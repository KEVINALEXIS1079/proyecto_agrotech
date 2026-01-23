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
import { TipoSensorService } from '../services/tipo-sensor.service';
import { CreateTipoSensorDto } from '../dto/create-tipo-sensor.dto';
import { UpdateTipoSensorDto } from '../dto/update-tipo-sensor.dto';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { CustomFileInterceptor } from 'src/common/services/uploads/custom-file.interceptor';
import { TipoSensorGateway } from '../gateways/tipo-sensor.gateway';
import { TipoSensorDocs } from '../docs/tipo-sensor.docs';
import * as path from 'path'; 

@TipoSensorDocs.Controller() 
@Controller('tipo-sensor')
export class TipoSensorController {
  constructor(
    private readonly tipoSensorService: TipoSensorService,
    private readonly tipoSensorGateway: TipoSensorGateway,
  ) {}

  // =========================
  // Crear tipo de sensor
  // =========================
  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:tipo-sensor:create')
  @UseInterceptors(CustomFileInterceptor.create('imagen_tipo_sensor', 'tipo-sensor'))
  @TipoSensorDocs.Create()
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateTipoSensorDto,
  ) {
    // Igual que usuarios: guardar ruta relativa limpia
    const imgPath = file
      ? path.relative(process.cwd(), file.path).replace(/\\/g, '/')
      : undefined;

    if (imgPath) dto.imagen_tipo_sensor = imgPath;

    const tipoSensor = await this.tipoSensorService.create(dto);
    this.tipoSensorGateway.notifyChanges('create', tipoSensor);
    return tipoSensor;
  }

  // =========================
  // Obtener todos los tipos de sensor
  // =========================
  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:tipo-sensor:read')
  @TipoSensorDocs.FindAll()
  findAll() {
    return this.tipoSensorService.findAll();
  }

  // =========================
  // Obtener tipos de sensor eliminados
  // =========================
  @Get('deleted')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:tipo-sensor:read')
  @TipoSensorDocs.FindAllDeleted()
  findAllDeleted() {
    return this.tipoSensorService.findAllDeleted();
  }

  // =========================
  // Obtener tipo de sensor por ID
  // =========================
  @Get(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:tipo-sensor:read')
  @TipoSensorDocs.FindOne()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tipoSensorService.findOne(id);
  }

  // =========================
  // Actualizar tipo de sensor
  // =========================
  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:tipo-sensor:update')
  @UseInterceptors(CustomFileInterceptor.create('imagen_tipo_sensor', 'tipo-sensor'))
  @TipoSensorDocs.Update()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateTipoSensorDto,
  ) {
    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException('Se requiere al menos un campo para actualizar');
    }

    // Igual que en create: normalizar ruta
    const imgPath = file
      ? path.relative(process.cwd(), file.path).replace(/\\/g, '/')
      : undefined;

    if (imgPath) dto.imagen_tipo_sensor = imgPath;

    const updated = await this.tipoSensorService.update(id, dto);
    this.tipoSensorGateway.notifyChanges('update', updated);
    return updated;
  }

  // =========================
  // Eliminar tipo de sensor
  // =========================
  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:tipo-sensor:delete')
  @TipoSensorDocs.Remove()
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.tipoSensorService.remove(id);
    this.tipoSensorGateway.notifyChanges('delete', { id });
    return result;
  }

  // =========================
  // Restaurar tipo de sensor
  // =========================
  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('iot:tipo-sensor:update')
  @TipoSensorDocs.Restore()
  async restore(@Param('id', ParseIntPipe) id: number) {
    const result = await this.tipoSensorService.restore(id);
    this.tipoSensorGateway.notifyChanges('restore', { id });
    return result;
  }
}
