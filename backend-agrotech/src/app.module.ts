import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';

import { Usuario } from './usuario/usuarios/entities/usuario.entity';
import { Rol } from './usuario/roles/entities/role.entity';
import { InitService } from './init/init.service';

import { LotesModule } from './cultivo/lotes/lotes.module';
import { SublotesModule } from './cultivo/sublotes/sublotes.module';
import { CultivosModule } from './cultivo/cultivos/cultivos.module';
import { TipoCultivoModule } from './cultivo/tipo-cultivo/tipo-cultivo.module';
import { UsuariosModule } from './usuario/usuarios/usuarios.module';
import { RolesModule } from './usuario/roles/roles.module';
import { ProveedoresModule } from './inventario/proveedores/proveedores.module';
import { InsumosModule } from './inventario/insumos/insumos.module';
import { AlmacenModule } from './inventario/almacen/almacen.module';
import { CategoriasModule } from './inventario/categorias/categorias.module';
import { EpasModule } from './cultivo/epas/epas.module';
import { TiposEpasModule } from './cultivo/tipos_epas/tipos_epas.module';
import { InsumosProveedoresModule } from './inventario/insumo_proveedores/insumo_proveedores.module';
import { ActividadesModule } from './actividad/actividades/actividades.module';
import { CultivosActividadesModule } from './actividad/cultivos_actividades/cultivos_actividades.module';
import { SensoresModule } from './IoT/sensores/sensores.module';
import { TipoSensorModule } from './IoT/tipo_sensor/tipo_sensor.module';
import { EvidenciasModule } from './actividad/evidencias/evidencias.module';
import { UsuarioActividadModule } from './actividad/usuario_actividad/usuario_actividad.module';
import { AuthModule } from './autentication/auth/auth.module';
import { PermisosModule } from './autentication/permisos/permisos.module';
import { AuthorizationModule } from './middleware/authorization/authorization.module';
import { MovimientosInsumoModule } from './inventario/movimiento_insumo/movimiento_insumo.module';
import { CorreoModule } from './autentication/correo/correo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        url: `redis://${configService.get('REDIS_HOST', 'localhost')}:${configService.get('REDIS_PORT', '6379')}/${configService.get('REDIS_DB', '1')}`,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'agrotech',
      password: process.env.DB_PASSWORD || '123',
      database: process.env.DB_NAME || 'agrotech',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
      retryDelay: 3000,
      retryAttempts: 10,
    }),
    TypeOrmModule.forFeature([Usuario, Rol]), 
    UsuariosModule,
    RolesModule,
    ProveedoresModule,
    InsumosModule,
    AlmacenModule,
    CategoriasModule,
    EpasModule,
    TiposEpasModule,
    InsumosProveedoresModule,
    ActividadesModule,
    CultivosModule,
    CultivosActividadesModule,
    LotesModule,
    SublotesModule,
    TipoCultivoModule,
    SensoresModule,
    TipoSensorModule,
    EvidenciasModule,
    UsuarioActividadModule,
    AuthModule,
    PermisosModule,
    AuthorizationModule,
    MovimientosInsumoModule,
    CorreoModule,
  ],
  controllers: [AppController],
  providers: [AppService, InitService],
})
export class AppModule {}
