import { Module } from '@nestjs/common';
import { MovimientosProductosService } from './movimientos_productos.service';
import { MovimientosProductosController } from './movimientos_productos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimientosProductos } from './entities/movimientos_producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MovimientosProductos])],
  controllers: [MovimientosProductosController],
  providers: [MovimientosProductosService],
})
export class MovimientosProductosModule {}