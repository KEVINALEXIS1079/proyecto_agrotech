import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsuariosService } from '../services/usuarios.service';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { RegistrarUsuarioPublicDTO } from '../dto/crear-usuario-public.dto';
import { CambiarContrasenaDto } from '../dto/cambiar-contrasena.dto';
import { RecuperarContrasenaDto } from '../dto/recuperar-contrasena.dto';
import { VerificarCodigoDto } from '../dto/verificar-codigo.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { CustomFileInterceptor } from 'src/common/services/uploads/custom-file.interceptor';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UsuariosGateway } from '../gateways/usuarios.gateway';


@ApiTags('Usuarios')
@ApiBearerAuth('access-token')
@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly usuariosGateway: UsuariosGateway,
  ) {}

@Post('public')
@UseInterceptors(CustomFileInterceptor.create('img_usuario', 'usuarios'))
@ApiConsumes('multipart/form-data')
@ApiOperation({
  summary: 'Registrar un usuario público',
  description:
    'Permite registrar un usuario sin autenticación previa con rol "Invitado". Incluye carga de imagen.',
})
@ApiResponse({
  status: 201,
  description: 'Usuario registrado exitosamente',
  schema: { example: { message: 'Usuario creado correctamente con rol: Invitado' } },
})
@ApiResponse({ status: 400, description: 'Correo o cédula ya existen' })
@ApiResponse({ status: 404, description: 'Rol "Invitado" no encontrado' })
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
) {
  // 1) preparar ruta de imagen (opcional: normalizar en Windows)
  // import * as path from 'path';  // si aún no lo tienes arriba
  const imgPath = file
    ? /** path.relative evita rutas absolutas largas en la BD */
      require('path').relative(process.cwd(), file.path).replace(/\\/g, '/')
    : undefined;

  // 2) crear usuario (esperar a que se guarde)
  const message = await this.usuariosService.createPublic(dto, imgPath);

  // 3) notificar a /usuarios para refrescar la tabla en tiempo real
  this.usuariosGateway.notifyUsersListChanged();

  // 4) responder
  return { message };
}


  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:usuarios:create')
  @UseInterceptors(CustomFileInterceptor.create('img_usuario', 'usuarios'))
  @ApiOperation({
    summary: 'Crear un usuario interno',
    description: 'Registra un usuario interno con autenticación y permisos. Requiere el permiso "usuario:usuarios:create". Incluye carga de imagen.',
  })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente', schema: { example: { message: 'Usuario creado correctamente con rol: [nombre_rol]' } } })
  @ApiResponse({ status: 400, description: 'Correo o cédula ya existen' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  async create(@Body() dto: CreateUsuarioDto, @UploadedFile() file?: Express.Multer.File) {
    const imgPath = file ? file.path : undefined;
    const result = await this.usuariosService.create(dto, imgPath);
    this.usuariosGateway.notifyUsersListChanged();
    return result;
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:usuarios:read')
  @ApiOperation({
    summary: 'Obtener todos los usuarios',
    description: 'Devuelve la lista completa de usuarios con sus relaciones. Requiere el permiso "usuario:usuarios:read".',
  })
  @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida exitosamente', schema: { example: [ /* ... */ ] } })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:usuarios:read')
  @ApiOperation({
    summary: 'Obtener un usuario por ID',
    description: 'Devuelve los detalles de un usuario específico según su ID. Requiere el permiso "usuario:usuarios:read".',
  })
  @ApiResponse({ status: 200, description: 'Usuario encontrado', schema: { example: { /* ... */ } } })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.findOne(id, ['permisos', 'permisos.module', 'rol', 'rol.permisos', 'rol.permisos.module']);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:usuarios:update')
  @UseInterceptors(CustomFileInterceptor.create('img_usuario', 'usuarios'))
  @ApiOperation({
    summary: 'Actualizar un usuario',
    description: 'Modifica los detalles de un usuario existente. Requiere el permiso "usuario:usuarios:update". Incluye carga de imagen.',
  })
  @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente', schema: { example: { /* ... */ } } })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Usuario o rol no encontrado' })
  @ApiBody({ type: UpdateUsuarioDto, /* ... */ })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUsuarioDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const imgPath = file ? file.path : undefined;
    const result = await this.usuariosService.update(id, dto, imgPath);
    this.usuariosGateway.notifyUsersListChanged();
    this.usuariosGateway.notifyProfileChanged(id);
    return result;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:usuarios:delete')
  @ApiOperation({
    summary: 'Eliminar un usuario',
    description: 'Elimina un usuario del sistema (soft delete). Requiere el permiso "usuario:usuarios:delete".',
  })
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente', schema: { example: { message: 'Usuario con ID 1 eliminado correctamente' } } })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.usuariosService.remove(id);
    this.usuariosGateway.notifyUsersListChanged();
    return result;
  }

  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:usuarios:update')
  @ApiOperation({
    summary: 'Restaurar un usuario eliminado',
    description: 'Restaura un usuario previamente eliminado. Requiere el permiso "usuario:usuarios:update".',
  })
  @ApiResponse({ status: 200, description: 'Usuario restaurado exitosamente', schema: { example: { message: 'Usuario con ID 1 restaurado correctamente' } } })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async restore(@Param('id', ParseIntPipe) id: number) {
    const result = await this.usuariosService.restore(id);
    this.usuariosGateway.notifyUsersListChanged();
    return result;
  }

  @Patch(':id/permisos/asignar')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:usuarios:update')
  @ApiOperation({
    summary: 'Asignar permisos a un usuario',
    description: 'Asigna permisos directos a un usuario específico. Requiere el permiso "usuario:usuarios:update".',
  })
  @ApiResponse({ status: 200, description: 'Permisos asignados exitosamente', schema: { example: { /* ... */ } } })
  @ApiResponse({ status: 400, description: 'Permisos ya asignados o inválidos' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Usuario o permisos no encontrados' })
  @ApiBody({ schema: { type: 'object', properties: { permisosIds: { type: 'array', items: { type: 'number' }, example: [1, 2, 3] } } } })
  async asignarPermisos(
    @Param('id', ParseIntPipe) id: number,
    @Body('permisosIds') permisosIds: number[],
  ) {
    const result = await this.usuariosService.asignarPermisos(id, permisosIds);
    this.usuariosGateway.notifyProfileChanged(id);
    return result;
  }

  @Patch(':id/permisos/quitar')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:usuarios:update')
  @ApiOperation({
    summary: 'Quitar permisos a un usuario',
    description: 'Quita permisos directos a un usuario específico. Requiere el permiso "usuario:usuarios:update".',
  })
  @ApiResponse({ status: 200, description: 'Permisos quitados exitosamente', schema: { example: { /* ... */ } } })
  @ApiResponse({ status: 400, description: 'Permisos no encontrados en el usuario' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiBody({ schema: { type: 'object', properties: { permisosIds: { type: 'array', items: { type: 'number' }, example: [1, 2] } } } })
  async quitarPermisos(
    @Param('id', ParseIntPipe) id: number,
    @Body('permisosIds') permisosIds: number[],
  ) {
    const result = await this.usuariosService.quitarPermisos(id, permisosIds);
    this.usuariosGateway.notifyProfileChanged(id);
    return result;
  }

  @Patch(':id/rol')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:usuarios:update')
  @ApiOperation({
    summary: 'Asignar rol a un usuario',
    description: 'Asigna un rol a un usuario específico. Requiere el permiso "usuario:usuarios:update".',
  })
  @ApiResponse({ status: 200, description: 'Rol asignado exitosamente', schema: { example: { /* ... */ } } })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Usuario o rol no encontrado' })
  @ApiBody({ schema: { type: 'object', properties: { rolId: { type: 'number', example: 2 } } } })
  async asignarRol(
    @Param('id', ParseIntPipe) id: number,
    @Body('rolId', ParseIntPipe) rolId: number,
  ) {
    const result = await this.usuariosService.asignarRol(id, rolId);
    this.usuariosGateway.notifyProfileChanged(id);
    return result;
  }

  @Post('recuperar-contrasena')
  @ApiOperation({
    summary: 'Solicitar recuperación de contraseña',
    description: 'Envía un código de verificación al correo del usuario para recuperar la contraseña.',
  })
  @ApiResponse({ status: 200, description: 'Solicitud de recuperación enviada exitosamente', /* ... */ })
  @ApiResponse({ status: 400, description: 'Correo inválido o no encontrado' })
  @ApiBody({ type: RecuperarContrasenaDto, /* ... */ })
  recuperarContrasena(@Body() dto: RecuperarContrasenaDto) {
    return this.usuariosService.recuperarContrasena(dto);
  }

  @Post('verificar-codigo')
  @ApiOperation({
    summary: 'Verificar código de recuperación',
    description: 'Verifica el código de verificación enviado al correo del usuario.',
  })
  @ApiResponse({ status: 200, description: 'Código verificado exitosamente', /* ... */ })
  @ApiResponse({ status: 400, description: 'Código o correo inválido' })
  @ApiBody({ type: VerificarCodigoDto, /* ... */ })
  verificarCodigo(@Body() dto: VerificarCodigoDto) {
    return this.usuariosService.verificarCodigo(dto);
  }

  @Post('cambiar-contrasena')
  @ApiOperation({
    summary: 'Cambiar contraseña',
    description: 'Permite al usuario cambiar su contraseña tras verificar el código.',
  })
  @ApiResponse({ status: 200, description: 'Contraseña cambiada exitosamente', /* ... */ })
  @ApiResponse({ status: 400, description: 'Datos inválidos o código no verificado' })
  @ApiBody({ type: CambiarContrasenaDto, /* ... */ })
  cambiarContrasena(@Body() dto: CambiarContrasenaDto) {
    return this.usuariosService.cambiarContrasena(dto);
  }
}