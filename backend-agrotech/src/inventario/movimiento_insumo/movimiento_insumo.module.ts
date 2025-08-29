import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimientosInsumoService } from './movimiento_insumo.service';
import { MovimientosInsumoController } from './movimiento_insumo.controller';
import { MovimientoInsumo } from './entities/movimiento_insumo.entity';
import { Insumo } from 'src/inventario/insumos/entities/insumo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MovimientoInsumo, Insumo])],
  controllers: [MovimientosInsumoController],
  providers: [MovimientosInsumoService],
  exports: [MovimientosInsumoService],
})
export class MovimientosInsumoModule {}
