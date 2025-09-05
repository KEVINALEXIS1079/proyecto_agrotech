import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';

import { Usuario } from '../modules/usuario/usuarios/entities/usuario.entity';
import { Rol } from '../modules/usuario/roles/entities/rol.entity';
import { CreateAdminSeed} from '../database/seeds/create-admin.seed';

import { LotesModule } from '../modules/cultivo/lotes/lotes.module';
import { SublotesModule } from '../modules/cultivo/sublotes/sublotes.module';
import { CultivosModule } from '../modules/cultivo/cultivos/cultivos.module';
import { TipoCultivoModule } from '../modules/cultivo/tipo-cultivo/tipo-cultivo.module';
import { UsuariosModule } from '../modules/usuario/usuarios/usuarios.module';
import { RolesModule } from '../modules/usuario/roles/roles.module';
import { ProveedoresModule } from '../modules/inventario/proveedores/proveedores.module';
import { InsumosModule } from '../modules/inventario/insumos/insumos.module';
import { AlmacenModule } from '../modules/inventario/almacenes/almacenes.module';
import { CategoriasModule } from '../modules/inventario/categorias/categorias.module';
import { EpasModule } from '../modules/cultivo/epas/epas.module';
import { TiposEpasModule } from '../modules/cultivo/tipo-epa/tipo-epa.module';
import { InsumoProveedorModule } from '../modules/inventario/insumo-proveedor/insumo-proveedor.module';
import { ActividadesModule } from '../modules/actividad/actividades/actividades.module';
import { CultivosActividadesModule } from '../modules/actividad/cultivo-actividad/cultivo-actividad.module';
import { SensoresModule } from '../modules/iot/sensores/sensores.module';
import { TipoSensorModule } from '../modules/iot/tipo-sensor/tipo_sensor.module';
import { EvidenciasModule } from '../modules/actividad/evidencias/evidencias.module';
import { UsuarioActividadModule } from '../modules/actividad/usuario-actividad/usuario-actividad.module';
import { AuthModule } from '../modules/authentication/auth/auth.module';
import { PermisosModule } from '../common/middleware/permisos/permisos.module';
import { MovimientoInsumoModule } from '../modules/inventario/movimiento-insumo/movimiento-insumo.module';
import { CorreoModule } from '../common/middleware/correo/correo.module';


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
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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
    InsumoProveedorModule,
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
    MovimientoInsumoModule,
    CorreoModule,
  ],
  controllers: [AppController],
  providers: [AppService, CreateAdminSeed],
})
export class AppModule {}
