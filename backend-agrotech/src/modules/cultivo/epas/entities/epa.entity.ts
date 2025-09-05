import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TipoEpa } from 'src/modules/cultivo/tipo-epa/entities/tipo-epa.entity';
import { Cultivo } from 'src/modules/cultivo/cultivos/entities/cultivo.entity';

export enum EstadoEpaEnum {
  PRESENTE = 'presente',
  AUSENTE = 'ausente',
}

@Entity({ name: 'epas' })
export class Epa {
  @PrimaryGeneratedColumn()
  id_epa_pk: number;

  @Column()
  nombre_epa: string;

  @Column()
  descripcion_epa: string;

  @Column({
    type: 'enum',
    enum: EstadoEpaEnum,
    name: 'estado_epa_enum',
  })
  estado: EstadoEpaEnum;

  //  Relación con TipoEpa
  @ManyToOne(() => TipoEpa, (tipoEpa) => tipoEpa.epas, { nullable: false })
  @JoinColumn({ name: 'id_tipo_epa_fk' })
  tipoEpa: TipoEpa;

  //  Relación con Cultivo
  @ManyToOne(() => Cultivo, (cultivo) => cultivo.epas, { nullable: false })
  @JoinColumn({ name: 'id_cultivo_fk' })
  cultivo: Cultivo;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
