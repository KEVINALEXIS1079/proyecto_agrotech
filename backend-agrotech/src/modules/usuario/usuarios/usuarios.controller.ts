import {
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  Body,
  ParseIntPipe,
  UseGuards,
  Request,
  ForbiddenException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { Roles } from 'src/common/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { RegistrarUsuarioPublicDTO } from './dto/crear-usuario-public.dto';
import { CustomFileInterceptor } from 'src/common/services/uploads/custom-file.interceptor';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // Registro público
  @Post('public')
  @UseInterceptors(CustomFileInterceptor.create('img_usuario', 'usuarios'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        cedula_usuario: { type: 'string', example: '1234567890' },
        nombre_usuario: { type: 'string', example: 'María' },
        apellido_usuario: { type: 'string', example: 'Rojas' },
        telefono_usuario: { type: 'string', example: '3205874152' },
        correo_usuario: { type: 'string', example: 'usuario@gmail.com' },
        contrasena_usuario: { type: 'string', example: 'clave123' },
        img_usuario: { type: 'string', format: 'binary' },
      },
    },
  })
  async createPublic(
    @Body() dto: RegistrarUsuarioPublicDTO,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<string> {
    const imgPath = file ? file.path : undefined;
    return this.usuariosService.createPublic(dto, imgPath);
  }

  // Crear usuario por admin/instructor
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  @UseInterceptors(CustomFileInterceptor.create('img_usuario', 'usuarios'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        cedula_usuario: { type: 'string', example: '987654321' },
        nombre_usuario: { type: 'string', example: 'Ana' },
        apellido_usuario: { type: 'string', example: 'Torres' },
        telefono_usuario: { type: 'string', example: '3001122334' },
        correo_usuario: { type: 'string', example: 'ana@email.com' },
        contrasena_usuario: { type: 'string', example: '123456' },
        id_rol_fk: { type: 'integer', example: 2 },
        img_usuario: { type: 'string', format: 'binary' },
      },
    },
  })
  async create(
    @Body() dto: CreateUsuarioDto,
    @Request() req,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<string> {
    const rolSolicitante = req.user.rol.nombre_rol;

    if (rolSolicitante === 'Instructor' && dto.id_rol_fk === 1) {
      throw new ForbiddenException(
        'El instructor no puede crear usuarios con rol Administrador',
      );
    }

    if (['Pasante', 'Aprendiz', 'Invitado'].includes(rolSolicitante)) {
      throw new ForbiddenException('No tienes permisos para crear usuarios');
    }

    const imgPath = file ? file.path : undefined;
    return this.usuariosService.create(dto, imgPath);
  }

  // Listar usuarios
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  async findAll(): Promise<Usuario[]> {
    return this.usuariosService.findAll();
  }

  // Buscar un usuario
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Usuario> {
    return this.usuariosService.findOne(id);
  }

  // Actualizar usuario
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  @UseInterceptors(CustomFileInterceptor.create('img_usuario', 'usuarios'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        cedula_usuario: { type: 'string', example: '11223344' },
        nombre_usuario: { type: 'string', example: 'Carlos' },
        apellido_usuario: { type: 'string', example: 'Gómez' },
        telefono_usuario: { type: 'string', example: '3219988776' },
        correo_usuario: { type: 'string', example: 'carlos@email.com' },
        contrasena_usuario: { type: 'string', example: '123456' },
        id_rol_fk: { type: 'integer', example: 3 },
        img_usuario: { type: 'string', format: 'binary' },
      },
    },
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUsuarioDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<string> {
    const imgPath = file ? file.path : undefined;
    return this.usuariosService.update(id, dto, imgPath);
  }

  // Eliminar usuario (soft delete)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.usuariosService.remove(id);
  }

  // Restaurar usuario eliminado
  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador')
  async restore(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.usuariosService.restore(id);
  }
}
