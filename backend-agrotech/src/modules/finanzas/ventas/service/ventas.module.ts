import { Module } from '@nestjs/common';
import { VentasService } from '../service/ventas.service';
import { VentasController } from '../controller/ventas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from '../entities/venta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venta])],
  controllers: [VentasController],
  providers: [VentasService],
  exports: [TypeOrmModule],
})
export class VentasModule {}


