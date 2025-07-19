import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sensor } from './entities/sensores.entity';
import { SensoresService } from './sensores.service';
import { SensoresController } from './sensores.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Sensor])],
  controllers: [SensoresController],
  providers: [SensoresService],
})
export class SensoresModule {}
