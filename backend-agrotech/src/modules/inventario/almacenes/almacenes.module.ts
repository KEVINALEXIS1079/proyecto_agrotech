// src/modules/almacenes/almacenes.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Almacen } from './entities/almacen.entity';
import { AlmacenesService } from './services/almacenes.service';
import { AlmacenesController } from './controllers/almacenes.controller';
import { AlmacenesGateway } from './gateways/almacenes.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Almacen])],
  controllers: [AlmacenesController],
  providers: [AlmacenesService, AlmacenesGateway],
  exports: [AlmacenesService],
})
export class AlmacenesModule {}
