import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CultivosService } from '../service/cultivos.service';
import { CultivosController } from '../controller/cultivos.controller';
import { Cultivo } from '../entities/cultivo.entity';
import { Sublote } from '../../sublotes/entities/sublote.entity';
import { TipoCultivo } from '../../tipo-cultivo/entities/tipo-cultivo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cultivo, Sublote, TipoCultivo]),
  ],
  controllers: [CultivosController],
  providers: [CultivosService],
  exports: [TypeOrmModule],
})
export class CultivosModule {}
