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
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { RecuperarContrasenaDto } from './dto/recuperar-contrasena.dto';
import { VerificarCodigoDto } from './dto/verificar-codigo.dto';
import { CambiarContrasenaDto } from './dto/cambiar-contrasena.dto';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { Roles } from 'src/autentication/permisos/roles.decorator';
import { JwtAuthGuard } from 'src/autentication/auth/jwt-auth.guard';
import { RolesGuard } from 'src/autentication/permisos/roles.guard';


@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // Crear usuarios
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  async create(@Body() dto: CreateUsuarioDto, @Request() req): Promise<string> {
    const rolSolicitante = req.user.rol.nombre_rol;

    if (rolSolicitante === 'Instructor' && dto.id_rol_fk === 1) {
      throw new ForbiddenException('El instructor no puede crear usuarios con rol Administrador');
    }

    if (['Pasante', 'Aprendiz', 'Usuario'].includes(rolSolicitante)) {
      throw new ForbiddenException('No tienes permisos para crear usuarios');
    }

    return this.usuariosService.create(dto);
  }

  // Listar todos
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante', 'Aprendiz', 'Usuario')
  findAll(): Promise<Usuario[]> {
    return this.usuariosService.findAll();
  }

  // Buscar uno
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor', 'Pasante', 'Aprendiz', 'Usuario')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Usuario> {
    return this.usuariosService.findOne(id);
  }

  // Buscar por email
  @Get('email/:email')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  findByEmail(@Param('email') email: string): Promise<Usuario> {
    return this.usuariosService.findOneByEmail(email);
  }

  // Actualizar
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUsuarioDto, @Request() req): Promise<string> {
    const rolSolicitante = req.user.rol.nombre_rol;
    const usuarioObjetivo = await this.usuariosService.findOne(id);

    if (rolSolicitante === 'Instructor' && usuarioObjetivo.rol.nombre_rol === 'Administrador') {
      throw new ForbiddenException('El instructor no puede actualizar usuarios con rol Administrador');
    }

    if (['Pasante', 'Aprendiz', 'Usuario'].includes(rolSolicitante)) {
      throw new ForbiddenException('No tienes permisos para actualizar usuarios');
    }

    return this.usuariosService.update(id, dto);
  }

  // Eliminar
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<string> {
    const rolSolicitante = req.user.rol.nombre_rol;
    const usuarioObjetivo = await this.usuariosService.findOne(id);

    if (rolSolicitante === 'Instructor' && usuarioObjetivo.rol.nombre_rol === 'Administrador') {
      throw new ForbiddenException('El instructor no puede eliminar usuarios con rol Administrador');
    }

    if (['Pasante', 'Aprendiz', 'Usuario'].includes(rolSolicitante)) {
      throw new ForbiddenException('No tienes permisos para eliminar usuarios');
    }

    return this.usuariosService.remove(id);
  }

  // Restaurar
  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Instructor')
  async restore(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<string> {
    const rolSolicitante = req.user.rol.nombre_rol;
    const usuarioObjetivo = await this.usuariosService.findOne(id);

    if (rolSolicitante === 'Instructor' && usuarioObjetivo.rol.nombre_rol === 'Administrador') {
      throw new ForbiddenException('El instructor no puede restaurar usuarios con rol Administrador');
    }

    if (['Pasante', 'Aprendiz', 'Usuario'].includes(rolSolicitante)) {
      throw new ForbiddenException('No tienes permisos para restaurar usuarios');
    }

    return this.usuariosService.restore(id);
  }

  // Recuperación de contraseña (sin autenticación requerida)
  @Post('solicitar-recuperacion')
  async solicitarRecuperacion(@Body() dto: RecuperarContrasenaDto): Promise<string> {
    return this.usuariosService.solicitarRecuperacion(dto.email);
  }

  @Post('verificar-codigo')
  async verificarCodigo(@Body() dto: VerificarCodigoDto): Promise<string> {
    return this.usuariosService.verificarCodigo(dto.email, dto.codigo);
  }

  @Post('cambiar-contrasena')
  async cambiarContrasena(@Body() dto: CambiarContrasenaDto): Promise<string> {
    return this.usuariosService.cambiarContrasena(dto.email, dto.codigo, dto.nuevaContrasena);
  }
}