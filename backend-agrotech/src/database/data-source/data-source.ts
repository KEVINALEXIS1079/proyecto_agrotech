import 'reflect-metadata';
import { DataSource } from 'typeorm';
/* import { TipoCultivo } from './cultivo/tipo-cultivo/entities/tipo-cultivo.entity';
import { Cultivo } from './cultivo/cultivos/entities/cultivo.entity';
import { Sublote } from './cultivo/sublotes/entities/sublote.entity';
import { Lote } from './cultivo/lotes/entities/lote.entity'; */

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'host.docker.internal',
  port: 5432,
  username: 'agrotech',
  password: '123',
  database: 'agrotech',
  synchronize: true,// true // Cambiar a false en producción
  logging: false,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: [],
});
