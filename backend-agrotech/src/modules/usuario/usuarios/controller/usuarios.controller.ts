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
import { UsuariosService } from '../service/usuarios.service';
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

@ApiTags('Usuarios') // Agrupa los endpoints bajo "Usuarios"
@ApiBearerAuth('access-token') // Indica que se requiere autenticación JWT
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // Registro público (no requiere permisos)
  @Post('public')
  @UseInterceptors(CustomFileInterceptor.create('img_usuario', 'usuarios'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Registrar un usuario público',
    description: 'Permite registrar un usuario sin autenticación previa con rol "Invitado". Incluye carga de imagen.',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
    schema: {
      example: { message: 'Usuario creado correctamente con rol: Invitado' },
    },
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
  createPublic(
    @Body() dto: RegistrarUsuarioPublicDTO,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const imgPath = file ? file.path : undefined;
    return this.usuariosService.createPublic(dto, imgPath);
  }

  // Crear usuario interno
  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:usuarios:create')
  @UseInterceptors(CustomFileInterceptor.create('img_usuario', 'usuarios'))
  @ApiOperation({
    summary: 'Crear un usuario interno',
    description: 'Registra un usuario interno con autenticación y permisos. Requiere el permiso "usuario:usuarios:create". Incluye carga de imagen.',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente',
    schema: {
      example: { message: 'Usuario creado correctamente con rol: [nombre_rol]' },
    },
  })
  @ApiResponse({ status: 400, description: 'Correo o cédula ya existen' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  create(@Body() dto: CreateUsuarioDto, @UploadedFile() file?: Express.Multer.File) {
    const imgPath = file ? file.path : undefined;
    return this.usuariosService.create(dto, imgPath);
  }

  // Listar todos los usuarios
  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:usuarios:read')
  @ApiOperation({
    summary: 'Obtener todos los usuarios',
    description: 'Devuelve la lista completa de usuarios con sus relaciones. Requiere el permiso "usuario:usuarios:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenida exitosamente',
    schema: {
      example: [
        {
          id_usuario_pk: 1,
          cedula_usuario: '1234567890',
          nombre_usuario: 'María',
          apellido_usuario: 'Rojas',
          telefono_usuario: '3205874152',
          correo_usuario: 'usuario@gmail.com',
          estado_usuario: 'activo',
          img_usuario: 'uploads/usuarios/usuario@gmail.com/avatar.png',
          rol: { id_rol_pk: 1, nombre_rol: 'Invitado' },
          permisos: [],
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  findAll() {
    return this.usuariosService.findAll();
  }

  // Traer usuario por ID
  @Get(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:usuarios:read')
  @ApiOperation({
    summary: 'Obtener un usuario por ID',
    description: 'Devuelve los detalles de un usuario específico según su ID. Requiere el permiso "usuario:usuarios:read".',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado',
    schema: {
      example: {
        id_usuario_pk: 1,
        cedula_usuario: '1234567890',
        nombre_usuario: 'María',
        apellido_usuario: 'Rojas',
        telefono_usuario: '3205874152',
        correo_usuario: 'usuario@gmail.com',
        estado_usuario: 'activo',
        img_usuario: 'uploads/usuarios/usuario@gmail.com/avatar.png',
        rol: { id_rol_pk: 1, nombre_rol: 'Invitado' },
        permisos: [],
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.findOne(id, ['permisos', 'permisos.module', 'rol', 'rol.permisos', 'rol.permisos.module']);
  }

  // Actualizar usuario
  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:usuarios:update')
  @UseInterceptors(CustomFileInterceptor.create('img_usuario', 'usuarios'))
  @ApiOperation({
    summary: 'Actualizar un usuario',
    description: 'Modifica los detalles de un usuario existente. Requiere el permiso "usuario:usuarios:update". Incluye carga de imagen.',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado exitosamente',
    schema: {
      example: {
        id_usuario_pk: 1,
        cedula_usuario: '1234567890',
        nombre_usuario: 'María Actualizada',
        apellido_usuario: 'Rojas',
        telefono_usuario: '3205874152',
        correo_usuario: 'usuario@gmail.com',
        estado_usuario: 'activo',
        img_usuario: 'uploads/usuarios/usuario@gmail.com/avatar_updated.png',
        rol: { id_rol_pk: 1, nombre_rol: 'Invitado' },
        permisos: [],
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Usuario o rol no encontrado' })
  @ApiBody({
    type: UpdateUsuarioDto,
    description: 'Datos para actualizar el usuario (campos opcionales)',
    examples: {
      valido: {
        value: {
          nombre_usuario: 'María Actualizada',
        },
        summary: 'Ejemplo válido',
      },
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUsuarioDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const imgPath = file ? file.path : undefined;
    return this.usuariosService.update(id, dto, imgPath);
  }

  // Eliminar usuario
  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:usuarios:delete')
  @ApiOperation({
    summary: 'Eliminar un usuario',
    description: 'Elimina un usuario del sistema (soft delete). Requiere el permiso "usuario:usuarios:delete".',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario eliminado exitosamente',
    schema: {
      example: { message: 'Usuario con ID 1 eliminado correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.remove(id);
  }

  // Restaurar usuario eliminado
  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:usuarios:update')
  @ApiOperation({
    summary: 'Restaurar un usuario eliminado',
    description: 'Restaura un usuario previamente eliminado. Requiere el permiso "usuario:usuarios:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario restaurado exitosamente',
    schema: {
      example: { message: 'Usuario con ID 1 restaurado correctamente' },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.restore(id);
  }

  // Asignar permisos directos al usuario
  @Patch(':id/permisos/asignar')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:usuarios:update')
  @ApiOperation({
    summary: 'Asignar permisos a un usuario',
    description: 'Asigna permisos directos a un usuario específico. Requiere el permiso "usuario:usuarios:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Permisos asignados exitosamente',
    schema: {
      example: {
        id_usuario_pk: 1,
        cedula_usuario: '1234567890',
        nombre_usuario: 'María',
        apellido_usuario: 'Rojas',
        telefono_usuario: '3205874152',
        correo_usuario: 'usuario@gmail.com',
        estado_usuario: 'activo',
        img_usuario: 'uploads/usuarios/usuario@gmail.com/avatar.png',
        rol: { id_rol_pk: 1, nombre_rol: 'Invitado' },
        permisos: [{ id_permiso_pk: 1, nombre_permiso: 'leer' }],
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Permisos ya asignados o inválidos' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Usuario o permisos no encontrados' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        permisosIds: { type: 'array', items: { type: 'number' }, example: [1, 2, 3] },
      },
    },
  })
  asignarPermisos(
    @Param('id', ParseIntPipe) id: number,
    @Body('permisosIds') permisosIds: number[],
  ) {
    return this.usuariosService.asignarPermisos(id, permisosIds);
  }

  // Quitar permisos directos al usuario
  @Patch(':id/permisos/quitar')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:usuarios:update')
  @ApiOperation({
    summary: 'Quitar permisos a un usuario',
    description: 'Quita permisos directos a un usuario específico. Requiere el permiso "usuario:usuarios:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Permisos quitados exitosamente',
    schema: {
      example: {
        id_usuario_pk: 1,
        cedula_usuario: '1234567890',
        nombre_usuario: 'María',
        apellido_usuario: 'Rojas',
        telefono_usuario: '3205874152',
        correo_usuario: 'usuario@gmail.com',
        estado_usuario: 'activo',
        img_usuario: 'uploads/usuarios/usuario@gmail.com/avatar.png',
        rol: { id_rol_pk: 1, nombre_rol: 'Invitado' },
        permisos: [],
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Permisos no encontrados en el usuario' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        permisosIds: { type: 'array', items: { type: 'number' }, example: [1, 2] },
      },
    },
  })
  quitarPermisos(
    @Param('id', ParseIntPipe) id: number,
    @Body('permisosIds') permisosIds: number[],
  ) {
    return this.usuariosService.quitarPermisos(id, permisosIds);
  }

  // Asignar rol al usuario
  @Patch(':id/rol')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('usuario:usuarios:update')
  @ApiOperation({
    summary: 'Asignar rol a un usuario',
    description: 'Asigna un rol a un usuario específico. Requiere el permiso "usuario:usuarios:update".',
  })
  @ApiResponse({
    status: 200,
    description: 'Rol asignado exitosamente',
    schema: {
      example: {
        id_usuario_pk: 1,
        cedula_usuario: '1234567890',
        nombre_usuario: 'María',
        apellido_usuario: 'Rojas',
        telefono_usuario: '3205874152',
        correo_usuario: 'usuario@gmail.com',
        estado_usuario: 'activo',
        img_usuario: 'uploads/usuarios/usuario@gmail.com/avatar.png',
        rol: { id_rol_pk: 2, nombre_rol: 'Administrador' },
        permisos: [{ id_permiso_pk: 1, nombre_permiso: 'leer' }],
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado (permiso insuficiente)' })
  @ApiResponse({ status: 404, description: 'Usuario o rol no encontrado' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        rolId: { type: 'number', example: 2 },
      },
    },
  })
  asignarRol(
    @Param('id', ParseIntPipe) id: number,
    @Body('rolId', ParseIntPipe) rolId: number,
  ) {
    return this.usuariosService.asignarRol(id, rolId);
  }

  // Recuperar contraseña
  @Post('recuperar-contrasena')
  @ApiOperation({
    summary: 'Solicitar recuperación de contraseña',
    description: 'Envía un código de verificación al correo del usuario para recuperar la contraseña.',
  })
  @ApiResponse({
    status: 200,
    description: 'Solicitud de recuperación enviada exitosamente',
    schema: {
      example: { message: 'Código de verificación enviado a usuario@ejemplo.com' },
    },
  })
  @ApiResponse({ status: 400, description: 'Correo inválido o no encontrado' })
  @ApiBody({
    type: RecuperarContrasenaDto,
    description: 'Datos requeridos para solicitar recuperación de contraseña',
    examples: {
      valido: {
        value: { email: 'usuario@ejemplo.com' },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: { email: 'correo-invalido' },
        summary: 'Ejemplo inválido',
      },
    },
  })
  recuperarContrasena(@Body() dto: RecuperarContrasenaDto) {
    return this.usuariosService.recuperarContrasena(dto);
  }

  // Verificar código
  @Post('verificar-codigo')
  @ApiOperation({
    summary: 'Verificar código de recuperación',
    description: 'Verifica el código de verificación enviado al correo del usuario.',
  })
  @ApiResponse({
    status: 200,
    description: 'Código verificado exitosamente',
    schema: {
      example: { message: 'Código verificado correctamente' },
    },
  })
  @ApiResponse({ status: 400, description: 'Código o correo inválido' })
  @ApiBody({
    type: VerificarCodigoDto,
    description: 'Datos requeridos para verificar el código',
    examples: {
      valido: {
        value: { email: 'usuario@ejemplo.com', codigo: '123456' },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: { email: 'usuario@ejemplo.com', codigo: '123' },
        summary: 'Ejemplo inválido',
      },
    },
  })
  verificarCodigo(@Body() dto: VerificarCodigoDto) {
    return this.usuariosService.verificarCodigo(dto);
  }

  // Cambiar contraseña
  @Post('cambiar-contrasena')
  @ApiOperation({
    summary: 'Cambiar contraseña',
    description: 'Permite al usuario cambiar su contraseña tras verificar el código.',
  })
  @ApiResponse({
    status: 200,
    description: 'Contraseña cambiada exitosamente',
    schema: {
      example: { message: 'Contraseña cambiada correctamente' },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o código no verificado' })
  @ApiBody({
    type: CambiarContrasenaDto,
    description: 'Datos requeridos para cambiar la contraseña',
    examples: {
      valido: {
        value: {
          email: 'usuario@ejemplo.com',
          codigo: '123456',
          nuevaContrasena: 'NuevaPassword123!',
        },
        summary: 'Ejemplo válido',
      },
      invalido: {
        value: {
          email: 'usuario@ejemplo.com',
          codigo: '123456',
          nuevaContrasena: 'abc', // Contraseña inválida (menos de 8 caracteres)
        },
        summary: 'Ejemplo inválido',
      },
    },
  })
  cambiarContrasena(@Body() dto: CambiarContrasenaDto) {
    return this.usuariosService.cambiarContrasena(dto);
  }
}