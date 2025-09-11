import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { EvidenciasService } from './evidencias.service';
import { CreateEvidenciaDto } from './dto/create-evidencia.dto';
import { UpdateEvidenciaDto } from './dto/update-evidencia.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { CustomFileInterceptor } from 'src/common/services/uploads/custom-file.interceptor';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';

@Controller('evidencias')
export class EvidenciasController {
  constructor(private readonly evidenciasService: EvidenciasService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante', 'Invitado')
  @UseInterceptors(CustomFileInterceptor.create('img_evidencia', 'evidencias'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nombre_evidencia: { type: 'string', example: 'Registro fotográfico de la poda' },
        descripcion_evidencia: { type: 'string', example: 'Fotografías después de la poda' },
        fecha_evidencia: { type: 'string', format: 'date', example: '2025-09-05' },
        observacion_evidencia: { type: 'string', example: 'Cultivo en buen estado' },
        fecha_inicio_evidencia: { type: 'string', format: 'date', example: '2025-09-01' },
        fecha_fin_evidencia: { type: 'string', format: 'date', example: '2025-09-04' },
        id_actividad_fk: { type: 'integer', example: 12 },
        img_evidencia: { type: 'string', format: 'binary' },
      },
    },
  })
  create(
    @Req() req: Request,
    @Body() dto: CreateEvidenciaDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.evidenciasService.create(dto, file?.path, req.user?.username);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante')
  findAll() {
    return this.evidenciasService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante')
  findOne(@Param('id') id: string) {
    return this.evidenciasService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante')
  @UseInterceptors(CustomFileInterceptor.create('img_evidencia', 'evidencias'))
  @ApiConsumes('multipart/form-data')
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateEvidenciaDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.evidenciasService.update(+id, dto, file?.path, req.user?.username);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  remove(@Param('id') id: string) {
    return this.evidenciasService.remove(+id);
  }

  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  restore(@Param('id') id: string) {
    return this.evidenciasService.restore(+id);
  }
}
