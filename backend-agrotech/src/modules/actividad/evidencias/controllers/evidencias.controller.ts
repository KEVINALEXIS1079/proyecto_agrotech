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
  applyDecorators,
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
import { EvidenciasGateway } from '../gateways/evidencia.gateway';
import { EvidenciasDocs } from '../docs/evidencias.docs'

// Helper para aplicar todos los ApiResponse de forma dinámica
function ApiResponses(responses: { status: number; description: string }[]) {
  return applyDecorators(...responses.map(r => ApiResponse(r)));
}

@ApiTags('Evidencias')
@ApiBearerAuth('access-token')
@Controller('evidencias')
export class EvidenciasController {
  constructor(
    private readonly evidenciasService: EvidenciasService,
    private readonly evidenciasGateway: EvidenciasGateway,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:evidencias:create')
  @ApiOperation(EvidenciasDocs.create.operation)
  @ApiConsumes('multipart/form-data')
  @ApiBody(EvidenciasDocs.create.body)
  @ApiResponses(EvidenciasDocs.create.response)
  @UseInterceptors(CustomFileInterceptor.create('img_evidencia', 'evidencias'))
  async create(
    @Req() req: Request,
    @Body() createEvidenciaDto: CreateEvidenciaDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const evidencia = await this.evidenciasService.create(createEvidenciaDto, file?.path, req.user?.username);
    this.evidenciasGateway.server.emit('evidencias:created', evidencia);
    return evidencia;
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:evidencias:read')
  @ApiOperation(EvidenciasDocs.findAll.operation)
  @ApiResponses(EvidenciasDocs.findAll.response)
  async findAll() {
    return await this.evidenciasService.findAll();
  }

  @Get(':id_evidencia_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:evidencias:read')
  @ApiOperation(EvidenciasDocs.findOne.operation)
  @ApiResponses(EvidenciasDocs.findOne.response)
  async findOne(@Param('id_evidencia_pk', ParseIntPipe) id_evidencia_pk: number) {
    return await this.evidenciasService.findOne(id_evidencia_pk);
  }

  @Patch(':id_evidencia_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:evidencias:update')
  @ApiOperation(EvidenciasDocs.update.operation)
  @ApiConsumes('multipart/form-data')
  @ApiBody(EvidenciasDocs.update.body)
  @ApiResponses(EvidenciasDocs.update.response)
  @UseInterceptors(CustomFileInterceptor.create('img_evidencia', 'evidencias'))
  async update(
    @Req() req: Request,
    @Param('id_evidencia_pk', ParseIntPipe) id_evidencia_pk: number,
    @Body() updateEvidenciaDto: UpdateEvidenciaDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const evidencia = await this.evidenciasService.update(id_evidencia_pk, updateEvidenciaDto, file?.path, req.user?.username);
    this.evidenciasGateway.server.emit('evidencias:updated', evidencia);
    return evidencia;
  }

  @Delete(':id_evidencia_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:evidencias:delete')
  @ApiOperation(EvidenciasDocs.remove.operation)
  @ApiResponses(EvidenciasDocs.remove.response)
  async remove(@Param('id_evidencia_pk', ParseIntPipe) id_evidencia_pk: number) {
    const deleted = await this.evidenciasService.remove(id_evidencia_pk);
    this.evidenciasGateway.server.emit('evidencias:removed', { id_evidencia_pk });
    return deleted;
  }

  @Patch('restore/:id_evidencia_pk')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('actividad:evidencias:update')
  @ApiOperation(EvidenciasDocs.restore.operation)
  @ApiResponses(EvidenciasDocs.restore.response)
  async restore(@Param('id_evidencia_pk', ParseIntPipe) id_evidencia_pk: number) {
    const evidencia = await this.evidenciasService.restore(id_evidencia_pk);
    this.evidenciasGateway.server.emit('evidencias:restored', evidencia);
    return evidencia;
  }
}