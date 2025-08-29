import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Epa } from '../../epas/entities/epa.entity';

export enum TipoEpaEnum {
  ENFERMEDAD = 'enfermedad',
  PLAGA = 'plaga',
  ARVENSE = 'arvense',
}

@Entity({ name: 'tipos_epa' })
export class TipoEpa {
  @PrimaryGeneratedColumn()
  id_tipo_epa_pk: number;

  @Column()
  nombre_tipo_epa: string;

  @Column()
  descripcion: string;

  @Column({
    type: 'enum',
    enum: TipoEpaEnum,
    name: 'tipo_epa_enum',
  })
  tipo_epa_enum: TipoEpaEnum;

  //  Relación inversa con Epa
  @OneToMany(() => Epa, (epa) => epa.tipoEpa)
  epas: Epa[];

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date;
}
