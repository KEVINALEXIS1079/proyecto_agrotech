import {
  IsString, IsInt,IsDateString,Length,} from 'class-validator';

export class CreateEvidenciaDto {

 
  @IsString({ message: 'La descripción de la evidencia debe ser una cadena de texto' })
  @Length(1, 255, { message: 'La descripción debe tener entre 1 y 255 caracteres' })
  descripcion_evidencia: string;


  @IsDateString({}, { message: 'La fecha de la evidencia debe tener formato YYYY-MM-DD' })
  fecha_evidencia: Date;


  @IsString({ message: 'La observación debe ser una cadena de texto' })
  observacion_evidencia: string;

  
  @IsDateString({}, { message: 'La fecha de inicio debe tener formato YYYY-MM-DD' })
  fecha_inicio_evidencia: Date;

  
  @IsDateString({}, { message: 'La fecha de fin debe tener formato YYYY-MM-DD' })
  fecha_fin_evidencia: Date;

  
  @IsInt({ message: 'El id de la actividad debe ser un número entero' })
  id_actividad_fk: number;

  
  @IsString({ message: 'La ruta de la imagen debe ser una cadena de texto' })
  ruta_imagen: string;
}
