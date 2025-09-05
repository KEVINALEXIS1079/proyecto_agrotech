import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth') 
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Endpoint para login
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({
    status: 201,
    description: 'Login exitoso',
    schema: {
      example: {
        message: 'Login correcto',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.correo_usuario, body.contrasena_usuario);
  }

  // Endpoint protegido para obtener el perfil del usuario autenticado
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiBearerAuth() // Swagger habilita campo para JWT
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
    return req.user; // devuelto por jwt.strategy.ts en validate()
  }
}
