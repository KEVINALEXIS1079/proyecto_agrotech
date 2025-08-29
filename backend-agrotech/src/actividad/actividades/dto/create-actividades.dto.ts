import {IsString,IsInt,IsNumber,IsDateString,Length,
} from 'class-validator';

/*
  DTO para crear una nueva actividad.
  Contiene validaciones de tipo, longitud y formato.
*/
export class CreateActividadesDto {
  // Estado de la actividad
  @IsString({ message: 'El estado de la actividad debe ser una cadena de texto' })
  @Length(1, 255, { message: 'El estado debe tener entre 1 y 255 caracteres' })
  estado_actividad: string;

  // Descripción de la actividad
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion_actividad: string;

  // Nombre de la actividad
  @IsString({ message: 'El nombre de la actividad debe ser una cadena de texto' })
  @Length(1, 255, { message: 'El nombre debe tener entre 1 y 255 caracteres' })
  nombre_actividad: string;

  // Tiempo estimado (en horas o minutos)
  @IsInt({ message: 'El tiempo estimado debe ser un número entero' })
  tiempo_actividad: number;

  // Costo de mano de obra
  @IsNumber({}, { message: 'El costo de mano de obra debe ser un número' })
  costo_mano_obra_actividad: number;

  // Fecha de la actividad
  @IsDateString({}, { message: 'La fecha de la actividad debe tener formato YYYY-MM-DD' })
  fecha_actividad: Date;

  // Fecha de inicio
  @IsDateString({}, { message: 'La fecha de inicio debe tener formato YYYY-MM-DD' })
  fecha_inicio_actividad: Date;

  // Fecha de fin
  @IsDateString({}, { message: 'La fecha de fin debe tener formato YYYY-MM-DD' })
  fecha_fin_actividad: Date;

  // Relación con tipo de actividad (FK)
  @IsInt({ message: 'El id del tipo de actividad debe ser un número entero' })
  id_tipo_actividad_fk: number;
}
