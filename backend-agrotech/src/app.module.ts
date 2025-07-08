import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LotesModule } from './lotes/lotes.module';
import { SublotesModule } from './sublotes/sublotes.module';
import { CultivosModule } from './cultivos/cultivos.module';
import { TipoCultivoModule } from './tipo-cultivo/tipo-cultivo.module';

@Module({
  imports: [
    LotesModule,
    SublotesModule,
    CultivosModule,
    TipoCultivoModule,

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'agrotech',
      password: '123',
      database: 'agrotech',
      autoLoadEntities: true,
      synchronize: true,
      retryDelay: 3000,
      retryAttempts: 10,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
