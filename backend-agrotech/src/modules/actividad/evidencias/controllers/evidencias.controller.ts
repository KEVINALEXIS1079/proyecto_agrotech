import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { EvidenciasService } from '../services/evidencias.service';
import { CreateEvidenciaDto } from '../dto/create-evidencia.dto';
import { UpdateEvidenciaDto } from '../dto/update-evidencia.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { CustomFileInterceptor } from 'src/common/services/uploads/custom-file.interceptor';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Evidencias')
@ApiBearerAuth('access-token')
@Controller('evidencias')
export class EvidenciasController {
  constructor(private readonly evidenciasService: EvidenciasService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:evidencias:create')
  @ApiOperation({
    summary: 'Crear una nueva evidencia',
    description: 'Crea una nueva evidencia asociada a una actividad. Requiere el permiso "actividad:evidencias:create".',
  })
  @ApiResponse({
    status: 201,
    description: 'Evidencia creada exitosamente',
    schema: {
      example: {
        id_evidencia_pk: 1,
        nombre_evidencia: 'Registro fotográfico de la poda',
        descripcion_evidencia: 'Fotografías que muestran el estado del cultivo después de la poda realizada en el lote 2',
        fecha_evidencia: '2025-09-19',
        observacion_evidencia: 'El cultivo presenta un desarrollo saludable tras la poda',
        fecha_inicio_evidencia: '2025-09-20',
        fecha_fin_evidencia: '2025-09-25',
        id_actividad_fk: 12,
        img_evidencia: 'uploads/evidencias/123456789.jpg',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nombre_evidencia: { type: 'string', example: 'Registro fotográfico de la poda' },
        descripcion_evidencia: { type: 'string', example: 'Fotografías que muestran el estado del cultivo después de la poda realizada en el lote 2' },
        fecha_evidencia: { type: 'string', format: 'date', example: '2025-09-19' },
        observacion_evidencia: { type: 'string', example: 'El cultivo presenta un desarrollo saludable tras la poda' },
        fecha_inicio_evidencia: { type: 'string', format: 'date', example: '2025-09-20' },
        fecha_fin_evidencia: { type: 'string', format: 'date', example: '2025-09-25' },
        id_actividad_fk: { type: 'integer', example: 12 },
        img_evidencia: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(CustomFileInterceptor.create('img_evidencia', 'evidencias'))
  create(
    @Req() req: Request,
    @Body() dto: CreateEvidenciaDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.evidenciasService.create(dto, file?.path, req.user?.username);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:evidencias:read')
  @ApiOperation({
    summary: 'Obtener todas las evidencias',
    description: 'Devuelve la lista completa de evidencias registradas. Requiere el permiso "actividad:evidencias:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de evidencias obtenida exitosamente',
    schema: {
      example: [
        {
          id_evidencia_pk: 1,
          nombre_evidencia: 'Registro fotográfico de la poda',
          id_actividad_fk: 12,
        },
        {
          id_evidencia_pk: 2,
          nombre_evidencia: 'Evidencia de riego',
          id_actividad_fk: 13,
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  findAll() {
    return this.evidenciasService.findAll();
  }

  @Get(':id_evidencia_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:evidencias:read')
  @ApiOperation({
    summary: 'Obtener una evidencia por ID',
    description: 'Devuelve los detalles de una evidencia específica según su ID. Requiere el permiso "actividad:evidencias:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Evidencia encontrada',
    schema: {
      example: {
        id_evidencia_pk: 1,
        nombre_evidencia: 'Registro fotográfico de la poda',
        descripcion_evidencia: 'Fotografías que muestran el estado del cultivo después de la poda realizada en el lote 2',
        fecha_evidencia: '2025-09-19',
        observacion_evidencia: 'El cultivo presenta un desarrollo saludable tras la poda',
        fecha_inicio_evidencia: '2025-09-20',
        fecha_fin_evidencia: '2025-09-25',
        id_actividad_fk: 12,
        img_evidencia: 'uploads/evidencias/123456789.jpg',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Evidencia no encontrada' })
  findOne(@Param('id_evidencia_pk', ParseIntPipe) id_evidencia_pk: number) {
    return this.evidenciasService.findOne(id_evidencia_pk);
  }

  @Patch(':id_evidencia_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:evidencias:update')
  @ApiOperation({
    summary: 'Actualizar una evidencia',
    description: 'Modifica los detalles de una evidencia existente. Requiere el permiso "actividad:evidencias:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Evidencia actualizada exitosamente',
    schema: {
      example: {
        id_evidencia_pk: 1,
        nombre_evidencia: 'Registro actualizado de la poda',
        descripcion_evidencia: 'Fotografías actualizadas del cultivo tras la poda',
        fecha_evidencia: '2025-09-19',
        observacion_evidencia: 'Cultivo en excelente estado tras actualización',
        fecha_inicio_evidencia: '2025-09-20',
        fecha_fin_evidencia: '2025-09-25',
        id_actividad_fk: 12,
        img_evidencia: 'uploads/evidencias/123456789_updated.jpg',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Evidencia no encontrada' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UpdateEvidenciaDto,
    description: 'Datos para actualizar la evidencia (campos opcionales)',
    examples: {
      valido: {
        value: {
          nombre_evidencia: 'Registro actualizado de la poda',
          descripcion_evidencia: 'Fotografías actualizadas del cultivo tras la poda',
          observacion_evidencia: 'Cultivo en excelente estado tras actualización',
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          nombre_evidencia: '', // Valor inválido (vacío)
          descripcion_evidencia: '', // Valor inválido (vacío)
          observacion_evidencia: '', // Valor inválido (vacío)
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  @UseInterceptors(CustomFileInterceptor.create('img_evidencia', 'evidencias'))
  update(
    @Req() req: Request,
    @Param('id_evidencia_pk', ParseIntPipe) id_evidencia_pk: number,
    @Body() dto: UpdateEvidenciaDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.evidenciasService.update(id_evidencia_pk, dto, file?.path, req.user?.username);
  }

  @Delete(':id_evidencia_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:evidencias:delete')
  @ApiOperation({
    summary: 'Eliminar una evidencia',
    description: 'Elimina una evidencia del sistema. Requiere el permiso "actividad:evidencias:delete".',
  })
  @ApiResponse({
    status: 200,
    description: 'Evidencia eliminada exitosamente',
    schema: {
      example: { message: 'Evidencia con ID 1 eliminada correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Evidencia no encontrada' })
  remove(@Param('id_evidencia_pk', ParseIntPipe) id_evidencia_pk: number) {
    return this.evidenciasService.remove(id_evidencia_pk);
  }

  @Patch('restore/:id_evidencia_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:evidencias:update')
  @ApiOperation({
    summary: 'Restaurar una evidencia eliminada',
    description: 'Restaura una evidencia previamente eliminada. Requiere el permiso "actividad:evidencias:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Evidencia restaurada exitosamente',
    schema: {
      example: { message: 'Evidencia con ID 1 restaurada correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Evidencia no encontrada' })
  restore(@Param('id_evidencia_pk', ParseIntPipe) id_evidencia_pk: number) {
    return this.evidenciasService.restore(id_evidencia_pk);
  }
}