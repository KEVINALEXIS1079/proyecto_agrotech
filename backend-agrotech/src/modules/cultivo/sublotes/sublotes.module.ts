import { Module } from '@nestjs/common';
import { SublotesService } from './sublotes.service';
import { SublotesController } from './sublotes.controller';
import { Sublote } from './entities/sublote.entity';
import { Lote } from '../lotes/entities/lote.entity';   
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Sublote, Lote])], 
  controllers: [SublotesController],
  providers: [SublotesService],
})
export class SublotesModule {}
