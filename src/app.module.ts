import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LotesModule } from './lotes/lotes.module';
import { SublotesModule } from './sublotes/sublotes.module';
import { CultivosModule } from './cultivos/cultivos.module';
import { TipoCultivoModule } from './tipo-cultivo/tipo-cultivo.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { RolesModule } from './roles/roles.module';
import { ProveedoresModule } from './proveedores/proveedores.module';
import { ActividadesModule } from './actividades/actividades.module';
import { EvidenciasModule } from './evidencias/evidencias.module';
import { TipoActividadModule } from './tipo-actividad/tipo-actividad.module';
import { UsuarioActividadModule } from './usuario-actividad/usuario-actividad.module';

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
    }),

    ActividadesModule,

    ProveedoresModule,

    EvidenciasModule,

    TipoActividadModule,

    UsuarioActividadModule,

  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
