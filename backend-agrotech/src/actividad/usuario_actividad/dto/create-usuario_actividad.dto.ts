import { IsInt, IsString, Length, IsNotEmpty, isNotEmpty } from 'class-validator';

export class CreateUsuarioActividadDto {
  // Documento de identidad del usuario (FK hacia usuarios)
  @IsString({ message: 'El DNI del usuario debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El DNI del usuario no puede estar vacío' })
  @Length(1, 10, { message: 'El DNI debe tener entre 1 y 10 caracteres' })
  dni_usuario_fk: string;
  @IsNotEmpty({ message: 'El DNI del usuario no puede estar vacío' })

  // ID de la actividad (FK hacia actividades)
  @IsInt({ message: 'El ID de la actividad debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID de la actividad no puede estar vacío' })
  id_actividad_fk: number;
  
}
