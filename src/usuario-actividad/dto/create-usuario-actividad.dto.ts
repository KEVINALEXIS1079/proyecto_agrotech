import { IsInt, IsString, Length } from 'class-validator';

export class CreateUsuarioActividadDto {
  // Documento de identidad del usuario (FK hacia usuarios)
  @IsString({ message: 'El DNI del usuario debe ser una cadena de texto' })
  @Length(1, 10, { message: 'El DNI debe tener entre 1 y 10 caracteres' })
  dni_usuario_fk: string;

  // ID de la actividad (FK hacia actividades)
  @IsInt({ message: 'El ID de la actividad debe ser un número entero' })
  id_actividad_fk: number;
}
