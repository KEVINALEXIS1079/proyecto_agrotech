
import { 
  Column,  DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'actividades' })
export class Actividades {
  // Identificador único
  @PrimaryGeneratedColumn()
  id_actividad_pk: number;

  // Estado de la actividad
  @Column({ type: 'varchar', length: 255 })
  estado: string;

  // Descripción
  @Column({ type: 'text' })
  descripcion: string;

  // Nombre
  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  // Tiempo estimado
  @Column({ type: 'int' })
  tiempo: number;

  // Costo mano de obra
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  costo_mano_obra: number;

  // Fechas
  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'date' })
  fecha_inicio: Date;

  @Column({ type: 'date' })
  fecha_fin: Date;

  // Relación con tipo de actividad (FK)
  @Column({ type: 'int' })
  id_tipo_actividad: number;

  // Eliminación lógica
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  delete_at: Date;
}

