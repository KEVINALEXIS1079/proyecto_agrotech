import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlmacenesService } from './services/almacenes.service';
import { AlmacenesController } from './controllers/almacenes.controller';
import { Almacen } from './entities/almacen.entity';
import { AlmacenesGateway } from './gateways/almacenes.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Almacen])],
  controllers: [AlmacenesController],
  providers: [AlmacenesService, AlmacenesGateway],
  exports: [AlmacenesService]
})
export class AlmacenModule {}