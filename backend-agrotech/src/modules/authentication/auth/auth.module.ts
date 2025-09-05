import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/modules/usuario/usuarios/entities/usuario.entity';
import { UsuariosModule } from 'src/modules/usuario/usuarios/usuarios.module'; // Importar módulo de usuarios

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'tu_clave_secreta', // usa env en producción
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([Usuario]), // Registrar la entidad aquí
    UsuariosModule, //  Asegúrate de importar el módulo que exporta UsuarioService si lo necesitas
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
