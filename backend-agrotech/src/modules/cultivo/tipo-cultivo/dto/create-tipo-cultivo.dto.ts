import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para crear un nuevo tipo de cultivo.
 * Este objeto se utiliza para recibir y validar los datos enviados por el cliente.
 */
export class CreateTipoCultivoDto {
  @ApiProperty({
    description: 'Nombre del tipo de cultivo',
    example: 'Plátano',
    maxLength: 100,
  })
  @IsString({
    message: 'El nombre del tipo de cultivo debe ser una cadena de texto.',
  })
  @Length(1, 100, { message: 'El nombre debe tener entre 1 y 100 caracteres.' })
  nombre_tipo_cultivo!: string;
}
