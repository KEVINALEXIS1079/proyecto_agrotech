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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { EvidenciasService } from './evidencias.service';
import { CreateEvidenciaDto } from './dto/create-evidencia.dto';
import { UpdateEvidenciaDto } from './dto/update-evidencia.dto';
import { Roles } from 'src/common/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';

// Swagger
import { ApiConsumes, ApiBody } from '@nestjs/swagger';

@Controller('evidencias')
export class EvidenciasController {
  constructor(private readonly evidenciasService: EvidenciasService) {}

  //  Registrar evidencia con opción de subir imagen
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante')
  @UseInterceptors(
    FileInterceptor('img', {
      storage: diskStorage({
        destination: './uploads/evidencias',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `evidencia-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nombre_evidencia: { type: 'string', example: 'Registro fotográfico de la poda' },
        descripcion_evidencia: { type: 'string', example: 'Fotografías después de la poda' },
        fecha_evidencia: { type: 'string', format: 'date', example: '2025-09-05' },
        observacion_evidencia: { type: 'string', example: 'El cultivo presenta buen estado' },
        fecha_inicio_evidencia: { type: 'string', format: 'date', example: '2025-09-01' },
        fecha_fin_evidencia: { type: 'string', format: 'date', example: '2025-09-04' },
        id_actividad_fk: { type: 'integer', example: 12 },
        id_cultivo_fk: { type: 'integer', example: 3 },
        ruta_imagen: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  create(
    @Body() createEvidenciaDto: CreateEvidenciaDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.evidenciasService.create(createEvidenciaDto, file?.path);
  }

  //  Listar todas
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante')
  findAll() {
    return this.evidenciasService.findAll();
  }

  //  Buscar por ID
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante')
  findOne(@Param('id') id: string) {
    return this.evidenciasService.findOne(+id);
  }

  //  Actualizar con posibilidad de nueva imagen
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante')
  @UseInterceptors(
    FileInterceptor('img', {
      storage: diskStorage({
        destination: './uploads/evidencias',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `evidencia-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nombre_evidencia: { type: 'string', example: 'Registro fotográfico actualizado' },
        descripcion_evidencia: { type: 'string', example: 'Nueva descripción de la evidencia' },
        fecha_evidencia: { type: 'string', format: 'date', example: '2025-09-06' },
        observacion_evidencia: { type: 'string', example: 'Observación actualizada' },
        fecha_inicio_evidencia: { type: 'string', format: 'date', example: '2025-09-02' },
        fecha_fin_evidencia: { type: 'string', format: 'date', example: '2025-09-07' },
        id_actividad_fk: { type: 'integer', example: 15 },
        id_cultivo_fk: { type: 'integer', example: 4 },
        ruta_imagen: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  update(
    @Param('id') id: string,
    @Body() updateEvidenciaDto: UpdateEvidenciaDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.evidenciasService.update(+id, updateEvidenciaDto, file?.path);
  }

  //  Eliminar
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
