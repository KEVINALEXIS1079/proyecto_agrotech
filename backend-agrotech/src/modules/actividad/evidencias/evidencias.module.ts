import { Module } from '@nestjs/common';
import { EvidenciasService } from './evidencias.service';
import { EvidenciasController } from './evidencias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evidencia } from './entities/evidencia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Evidencia])],
  controllers: [EvidenciasController],
  providers: [EvidenciasService],
})
export class EvidenciasModule {}
