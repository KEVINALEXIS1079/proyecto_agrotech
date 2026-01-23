import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimientoInsumoService } from './services/movimiento-insumo.service';
import { MovimientoInsumoController } from './controllers/movimiento-insumo.controller';
import { MovimientoInsumo } from './entities/movimiento-insumo.entity';
import { Insumo } from 'src/modules/inventario/insumos/entities/insumo.entity';
import { MovimientoInsumoGateway } from './gateways/movimiento-insumo.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([MovimientoInsumo, Insumo])],
  controllers: [MovimientoInsumoController],
  providers: [MovimientoInsumoService, MovimientoInsumoGateway],
  exports: [MovimientoInsumoService],
})
export class MovimientoInsumoModule {}
