import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/*
  DTO para crear un nuevo Tipo de Actividad.
  Contiene validaciones de obligatoriedad, tipo de dato y longitud máxima.
*/
export class CreateTipoActividadDto {
  @ApiProperty({
    description: 'Nombre del tipo de actividad',
    example: 'Riego',
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'El nombre del tipo de actividad es obligatorio' })
  @IsString({ message: 'El nombre del tipo de actividad debe ser texto' })
  @MaxLength(100, { message: 'El nombre no puede superar los 100 caracteres' })
  nombre_tipo_actividad: string;
}
