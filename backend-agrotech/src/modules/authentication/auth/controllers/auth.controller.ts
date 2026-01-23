import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto';
import { UsuariosService } from 'src/modules/usuario/usuarios/services/usuarios.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usuariosService: UsuariosService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 201, description: 'Login exitoso' })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.correo_usuario, body.contrasena_usuario);
  }

  @Get('profile') // ✅ Ruta solicitada
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Perfil del usuario autenticado' })
  async getProfile(@Request() req: any) {
    const { id_usuario_pk } = req.user as { id_usuario_pk: number };
    const u = await this.usuariosService.findByIdConRol(id_usuario_pk);
    if (!u) return null;

    // Estructura que espera el front (compat con adaptUsuarioLite)
    return {
      id_usuario_pk: u.id_usuario_pk,
      cedula_usuario: u.cedula_usuario,
      nombre_usuario: u.nombre_usuario,
      apellido_usuario: u.apellido_usuario,
      telefono_usuario: u.telefono_usuario,
      correo_usuario: u.correo_usuario,
      id_ficha: u.id_ficha ?? null,
      img_usuario: u.img_usuario ?? null,
      estado_usuario: u.estado_usuario,
      rol: u.rol ? { id_rol_pk: u.rol.id_rol_pk, nombre_rol: u.rol.nombre_rol } : null,
    };
  }
}
