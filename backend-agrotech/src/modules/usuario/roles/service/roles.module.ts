import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from '../entities/rol.entity';
import { RolesService } from '../service/roles.service';
import { RolesController } from '../controller/roles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Rol])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [
    RolesService,
    TypeOrmModule, 
  ],
})
export class RolesModule {}
