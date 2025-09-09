import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'evidencias' })
export class Evidencia {
  
  
  @PrimaryGeneratedColumn()
  id_evidencia_pk: number;


  @Column({ type: 'varchar', length: 255 })
  descripcion: string;

  @Column({ type: 'date' })
  fecha: Date;

  
  @Column({ type: 'varchar', length: 500 })
  observacion: string;

  @Column({ type: 'date' })
  fecha_inicio: Date;


  @Column({ type: 'date' })
  fecha_fin: Date;


  @Column({ type: 'int' })
  id_actividad: number;

 
  @Column({ type: 'varchar', length: 255 })
  imagen: string;

  
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  delete_at: Date;
}
