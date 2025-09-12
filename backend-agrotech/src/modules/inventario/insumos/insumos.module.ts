import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Insumo } from './entities/insumo.entity';
import { InsumosService } from './insumos.service';
import { InsumosController } from './insumos.controller';
import { Almacen } from '../almacenes/entities/almacen.entity';
import { Categoria } from '../categorias/entities/categoria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Insumo, Almacen, Categoria])],
  controllers: [InsumosController],
  providers: [InsumosService],
})
export class InsumosModule {}
