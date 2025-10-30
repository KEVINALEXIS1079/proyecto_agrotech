import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TokenRedisService } from './services/token-redis.service';

import { UsuariosModule } from 'src/modules/usuario/usuarios/usuarios.module';

@Module({
  imports: [
    ConfigModule, // 🔹 permite acceder a las variables de entorno
    PassportModule,
    UsuariosModule,

    // 🔹 Configura el módulo JWT usando variables de entorno
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'fallback_dev_secret'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN', '1d'),
        },
      }),
      inject: [ConfigService],
    }),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    JwtStrategy,
    TokenRedisService, // necesario para blacklist y control de tokens
  ],

  exports: [AuthService],
})
export class AuthModule {}
