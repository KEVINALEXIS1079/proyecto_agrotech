import {Controller,Get,Post,Body,Patch,Param,Delete,UseInterceptors,UploadedFile,} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';// para manejar la subida de archivos
import { diskStorage } from 'multer'; // para configurar el almacenamiento de archivos
import { extname } from 'path';// para obtener la extensión del archivo

import { EvidenciasService } from './evidencias.service';
import { CreateEvidenciaDto } from './dto/create-evidencia.dto';
import { UpdateEvidenciaDto } from './dto/update-evidencia.dto';
import { Roles } from 'src/autentication/permisos/roles.decorator'; 
import { JwtAuthGuard } from 'src/autentication/auth/jwt-auth.guard';
import { RolesGuard } from 'src/autentication/permisos/roles.guard';
import { UseGuards } from '@nestjs/common';

@Controller('evidencias')
export class EvidenciasController {
  constructor(private readonly evidenciasService: EvidenciasService) {}

  //  Registrar evidencia con opción de subir imagen
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) // Protegido por JWT y RolesGuard para asegurar que el usuario tiene el rol adecuado
  @Roles('Administrador', 'Instructor', 'Pasante', 'Usuario')
  @UseInterceptors(
    FileInterceptor('img', {
      storage: diskStorage({
        destination: './uploads/evidencias', // carpeta donde se guardan
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `evidencia-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  create(
    @Body() createEvidenciaDto: CreateEvidenciaDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.evidenciasService.create(createEvidenciaDto, file?.path); // pasamos la ruta del archivo al service
  }

  //  Listar todas
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante', 'Usuario')
  findAll() {
    return this.evidenciasService.findAll();
  }

  //  Buscar por ID
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante', 'Usuario')
  findOne(@Param('id') id: string) {
    return this.evidenciasService.findOne(+id);
  }

  //  Actualizar con posibilidad de nueva imagen
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante', 'Usuario')
  @UseInterceptors(
    FileInterceptor('img', {
      storage: diskStorage({
        destination: './uploads/evidencias',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `evidencia-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
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
