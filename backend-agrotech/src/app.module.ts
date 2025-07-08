import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from './usuarios/usuarios.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports:[
    UsuariosModule,
    RolesModule,

    TypeOrmModule.forRoot({
      type: 'postgres',
      host:'localhost',
      port:5432,
      username:'agrotech',
      password:'123',
      database:'agrotech',
      autoLoadEntities: true,
      synchronize:true,
      retryDelay:3000,
      retryAttempts:10,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
