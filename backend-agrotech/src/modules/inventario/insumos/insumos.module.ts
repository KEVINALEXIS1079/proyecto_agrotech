import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Insumo } from './entities/insumo.entity';
import { InsumosService } from './services/insumos.service';
import { InsumosController } from './controllers/insumos.controller';
import { Almacen } from '../almacenes/entities/almacen.entity';
import { Categoria } from '../categorias/entities/categoria.entity';
import { InsumosGateway } from './gateways/insumos.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Insumo, Almacen, Categoria])],
  controllers: [InsumosController],
  providers: [InsumosService, InsumosGateway],
  exports: [InsumosService],
})
export class InsumosModule {}
