import { Module } from '@nestjs/common';
import { SublotesService } from '../service/sublotes.service';
import { SublotesController } from '../controller/sublotes.controller';
import { Sublote } from '../entities/sublote.entity';
import { Lote } from '../../lotes/entities/lote.entity';   
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Sublote, Lote])], 
  controllers: [SublotesController],
  providers: [SublotesService],
})
export class SublotesModule {}
