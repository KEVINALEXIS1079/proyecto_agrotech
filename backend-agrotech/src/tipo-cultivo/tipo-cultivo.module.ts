import { Module } from '@nestjs/common';
import { TipoCultivoService } from './tipo-cultivo.service';
import { TipoCultivoController } from './tipo-cultivo.controller';
import { TipoCultivo } from './entities/tipo-cultivo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([TipoCultivo])],
  controllers: [TipoCultivoController],
  providers: [TipoCultivoService],
})
export class TipoCultivoModule {}
