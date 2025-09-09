
import { 
  Column,  DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tipo_actividades' })
export class TipoActividad {


  @PrimaryGeneratedColumn()
  id_tipo_actividad_pk: number;

  

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

   

  // Eliminación lógica
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  delete_at: Date;
}

