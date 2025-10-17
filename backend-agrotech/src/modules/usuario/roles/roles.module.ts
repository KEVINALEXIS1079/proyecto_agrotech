import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from './entities/rol.entity';
import { RolesService } from './services/roles.service';
import { RolesController } from './controllers/roles.controller';
import { Usuario } from 'src/modules/usuario/usuarios/entities/usuario.entity'; 

@Module({
  imports: [TypeOrmModule.forFeature([Rol, Usuario])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [
    RolesService,
  ],
})
export class RolesModule {}
