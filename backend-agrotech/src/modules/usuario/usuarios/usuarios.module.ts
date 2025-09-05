import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Rol } from '../roles/entities/rol.entity';
import { CorreoModule } from 'src/common/middleware/correo/correo.module';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Rol]),
    CorreoModule,
    RedisModule,
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [
    UsuariosService,
    TypeOrmModule, 
  ],
})
export class UsuariosModule {}
