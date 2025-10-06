import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlmacenesService } from '../service/almacenes.service';
import { AlmacenesController } from '../controller/almacenes.controller';
import { Almacen } from '../entities/almacen.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Almacen])],
  controllers: [AlmacenesController],
  providers: [AlmacenesService],
})
export class AlmacenModule {}