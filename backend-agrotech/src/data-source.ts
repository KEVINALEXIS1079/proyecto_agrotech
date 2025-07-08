import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { TipoCultivo } from './tipo-cultivo/entities/tipo-cultivo.entity';
import { Cultivo } from './cultivos/entities/cultivo.entity';
import { Sublote } from './sublotes/entities/sublote.entity';
import { Lote } from './lotes/entities/lote.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'host.docker.internal',
  port: 5432,
  username: 'agrotech',
  password: '123',
  database: 'agrotech',
  synchronize: false,
  logging: false,
  entities: [TipoCultivo, Cultivo, Sublote, Lote],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: [],
});
