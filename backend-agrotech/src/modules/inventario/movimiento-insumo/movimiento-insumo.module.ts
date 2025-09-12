import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimientoInsumoService } from './movimiento-insumo.service';
import { MovimientoInsumoController } from './movimiento-insumo.controller';
import { MovimientoInsumo } from './entities/movimiento-insumo.entity';
import { Insumo } from 'src/modules/inventario/insumos/entities/insumo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MovimientoInsumo, Insumo])],
  controllers: [MovimientoInsumoController],
  providers: [MovimientoInsumoService],
  exports: [MovimientoInsumoService],
})
export class MovimientoInsumoModule {}
