import { Module } from '@nestjs/common';
import { SublotesService } from './sublotes.service';
import { SublotesController } from './sublotes.controller';
import { Sublote } from './entities/sublote.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([Sublote])],
  controllers: [SublotesController],
  providers: [SublotesService],
})
export class SublotesModule {}
