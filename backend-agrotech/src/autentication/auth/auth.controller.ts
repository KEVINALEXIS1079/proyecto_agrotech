import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Endpoint para login
  @Post('login')
  async login(@Body() body: { correo_usuario: string; contrasena_usuario: string }) {
    return this.authService.login(body.correo_usuario, body.contrasena_usuario);
  }

  // Endpoint protegido para obtener el perfil del usuario autenticado
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user; // devuelto por jwt.strategy.ts en validate()
  }
}
