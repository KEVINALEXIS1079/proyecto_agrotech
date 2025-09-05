import { 
  IsString, 
  IsInt, 
  IsNumber, 
  IsDateString, 
  Length 
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/*
  DTO para crear una nueva actividad.
  Contiene validaciones de tipo, longitud y formato.
*/
export class CreateActividadDto {
  @ApiProperty({
    description: 'Estado de la actividad',
    example: 'En progreso',
    maxLength: 255,
  })
  @IsString({ message: 'El estado de la actividad debe ser una cadena de texto' })
  @Length(1, 255, { message: 'El estado debe tener entre 1 y 255 caracteres' })
  estado_actividad: string;

  @ApiProperty({
    description: 'Descripción detallada de la actividad',
    example: 'Podar las plantas en el lote 3 para mejorar la producción',
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion_actividad: string;

  @ApiProperty({
    description: 'Nombre de la actividad',
    example: 'Poda de plátano',
    maxLength: 255,
  })
  @IsString({ message: 'El nombre de la actividad debe ser una cadena de texto' })
  @Length(1, 255, { message: 'El nombre debe tener entre 1 y 255 caracteres' })
  nombre_actividad: string;

  @ApiProperty({
    description: 'Tiempo estimado de la actividad en horas',
    example: 4,
  })
  @IsInt({ message: 'El tiempo estimado debe ser un número entero' })
  tiempo_actividad: number;

  @ApiProperty({
    description: 'Costo de mano de obra asociado a la actividad',
    example: 150000,
  })
  @IsNumber({}, { message: 'El costo de mano de obra debe ser un número' })
  costo_mano_obra_actividad: number;

  @ApiProperty({
    description: 'Fecha en que se registra la actividad (formato YYYY-MM-DD)',
    example: '2025-09-10',
  })
  @IsDateString({}, { message: 'La fecha de la actividad debe tener formato YYYY-MM-DD' })
  fecha_actividad: Date;

  @ApiProperty({
    description: 'Fecha de inicio de la actividad (formato YYYY-MM-DD)',
    example: '2025-09-12',
  })
  @IsDateString({}, { message: 'La fecha de inicio debe tener formato YYYY-MM-DD' })
  fecha_inicio_actividad: Date;

  @ApiProperty({
    description: 'Fecha de finalización de la actividad (formato YYYY-MM-DD)',
    example: '2025-09-15',
  })
  @IsDateString({}, { message: 'La fecha de fin debe tener formato YYYY-MM-DD' })
  fecha_fin_actividad: Date;

  @ApiProperty({
    description: 'Identificador del tipo de actividad (relación con tabla tipo_actividad)',
    example: 2,
  })
  @IsInt({ message: 'El id del tipo de actividad debe ser un número entero' })
  id_tipo_actividad_fk: number;
}
