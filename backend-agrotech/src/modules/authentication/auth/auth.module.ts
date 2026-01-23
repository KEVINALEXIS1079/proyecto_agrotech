// src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

import { UsuariosModule } from 'src/modules/usuario/usuarios/usuarios.module';

@Module({
  imports: [
    ConfigModule,         // lee variables de entorno
    PassportModule,
    UsuariosModule,       // exporta UsuariosService que usa tu strategy/controller

    // Usa env y registra async para no hardcodear secretos
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'fallback_dev_secret'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN', '1d') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService], // exporta si otros módulos necesitan AuthService
})
export class AuthModule {}
