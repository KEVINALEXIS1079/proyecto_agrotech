import { Module } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from './entities/venta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venta])],
  controllers: [VentasController],
  providers: [VentasService],
  exports: [TypeOrmModule],
})
export class VentasModule {}


