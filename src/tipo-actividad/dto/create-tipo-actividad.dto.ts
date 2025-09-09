
import {
  IsString,
  Length,
} from 'class-validator';


export class CreateTipoActividadDto {
  
  @IsString({ message: 'El nombre de el tipo de actividad debe ser una cadena de texto' })
  @Length(1, 255, { message: 'El nombre debe tener entre 1 y 255 caracteres' })
nombre_tipo_actividad: string;
}
