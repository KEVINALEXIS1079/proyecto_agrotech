import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../../common/guard/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({
    status: 201,
    description: 'Login exitoso',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        usuario: {
          id: 1,
          correo: 'usuario@gmail.com',
          nombre: 'Juan',
          apellido: 'Pérez',
          rol: 'Administrador',
          permisos: [
            { accion: 'create', modulo: 'usuarios', permisoCompleto: 'usuarios:create' },
            { accion: 'read', modulo: 'usuarios', permisoCompleto: 'usuarios:read' },
          ],
        },
      },
    },
  })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.correo_usuario, body.contrasena_usuario);
  }

  
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario autenticado',
    schema: {
      example: {
        id_usuario: 1,
        nombre_usuario: 'Juan Pérez',
        correo_usuario: 'usuario@gmail.com',
      },
    },
  })
  getProfile(@Request() req: any) {
    return req.user;
  }
}
