import { Module } from '@nestjs/common';
import { CultivosService } from './cultivos.service';
import { CultivosController } from './cultivos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cultivo } from './entities/cultivo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cultivo])],
  controllers: [CultivosController],
  providers: [CultivosService],
})
export class CultivosModule {}
