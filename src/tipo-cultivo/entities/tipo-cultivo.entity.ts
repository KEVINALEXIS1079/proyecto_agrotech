import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Cultivo } from '../../cultivos/entities/cultivo.entity';

@Entity({ name: 'tipo_cultivo' })
export class TipoCultivo {
  //Identificador único autogenerado para cada tipo de cultivo.
  @PrimaryGeneratedColumn()
  id_tipo_cultivo_pk: number;

  //Nombre del tipo de cultivo (por ejemplo: plátano, cacao, maíz).
  @Column({ type: 'varchar', length: 100 })
  nombre_tipo_cultivo: string;

  //Relación uno a muchos: un tipo de cultivo puede tener muchos cultivos asociados.

  @OneToMany(() => Cultivo, (cultivo) => cultivo.tipoCultivo)
  cultivos: Cultivo[];

  // Fecha de eliminación lógica (soft delete)
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  delete_at: Date | null = null;
}
