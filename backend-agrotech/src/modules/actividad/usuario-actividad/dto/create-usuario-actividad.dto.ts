import { IsInt, IsString, Length, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioActividadDto {
  @ApiProperty({
    description: 'Documento de identidad del usuario (relación con tabla usuarios)',
    example: '1023456789',
    maxLength: 10,
  })
  @IsString({ message: 'El DNI del usuario debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El DNI del usuario no puede estar vacío' })
  @Length(1, 10, { message: 'El DNI debe tener entre 1 y 10 caracteres' })
  dni_usuario_fk: string;

  @ApiProperty({
    description: 'Identificador de la actividad (relación con tabla actividades)',
    example: 7,
  })
  @IsInt({ message: 'El ID de la actividad debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID de la actividad no puede estar vacío' })
  id_actividad_fk: number;
}
