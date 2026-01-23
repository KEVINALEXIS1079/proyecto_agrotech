import { Module } from '@nestjs/common';
import { CategoriasService } from './services/categorias.service';
import { CategoriasController } from './controllers/categorias.controller';
import { Categoria } from './entities/categoria.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriasGateway } from './gateways/categoria.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Categoria])],
  controllers: [CategoriasController],
  providers: [CategoriasService, CategoriasGateway],
  exports: [CategoriasService]
})
export class CategoriasModule {}