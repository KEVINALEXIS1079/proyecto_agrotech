import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sublote } from './entities/sublote.entity';
import { Lote } from '../lotes/entities/lote.entity';
import { SublotesService } from './services/sublotes.service';
import { SublotesGateway } from './gateways/sublotes.gateway';
import { SublotesController } from './controllers/sublotes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Sublote, Lote])],
  controllers: [SublotesController],
  providers: [SublotesService, SublotesGateway],
  exports: [SublotesService],
})
export class SublotesModule {}
