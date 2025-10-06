import { Module } from '@nestjs/common';
import { LotesService } from '../service/lotes.service';
import { LotesController } from '../controller/lotes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lote } from '../entities/lote.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Lote])],
  controllers: [LotesController],
  providers: [LotesService],
})
export class LotesModule {}
