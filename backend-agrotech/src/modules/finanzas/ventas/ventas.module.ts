import { Module } from '@nestjs/common';
import { VentasService } from './services/ventas.service';
import { VentasController } from './controllers/ventas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from './entities/venta.entity';
import { VentasGateway } from './gateways/venta.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Venta])],
  controllers: [VentasController],
  providers: [VentasService, VentasGateway],
  exports: [VentasService],
})
export class VentasModule {}


