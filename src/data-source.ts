import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { TipoCultivo } from './tipo-cultivo/entities/tipo-cultivo.entity';
import { Cultivo } from './cultivos/entities/cultivo.entity';
import { Sublote } from './sublotes/entities/sublote.entity';
import { Lote } from './lotes/entities/lote.entity';
import { Evidencia } from './evidencias/entities/evidencia.entity';
import { Actividades } from './actividades/entities/actividades.entity';
import { TipoActividad } from './tipo-actividad/entities/tipo-actividad.entity';
import { UsuarioActividad } from './usuario-actividad/entities/usuario-actividad.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'host.docker.internal',
  port: 5432,
  username: 'agrotech',
  password: '123',
  database: 'agrotech',
  synchronize: false,
  logging: false,
  entities: [TipoCultivo, Cultivo, Sublote, Lote,Evidencia,Actividades,TipoActividad,UsuarioActividad],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: [],
});
