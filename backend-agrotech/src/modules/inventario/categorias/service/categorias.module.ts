import { Module } from '@nestjs/common';
import { CategoriasService } from '../service/categorias.service';
import { CategoriasController } from '../controller/categorias.controller';
import { Categoria } from '../entities/categoria.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Categoria])],
  controllers: [CategoriasController],
  providers: [CategoriasService],
})
export class CategoriasModule {}