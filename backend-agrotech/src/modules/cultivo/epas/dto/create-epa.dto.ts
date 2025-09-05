import { IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { EstadoEpaEnum } from '../entities/epa.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEpaDto {
   @ApiProperty({
    description: 'Nombre del EPA (máximo 50 caracteres)',
    example: 'Sigatoga negra',
  })
  @IsString({ message: 'El nombre del EPA debe ser texto' })
  @IsNotEmpty({ message: 'El nombre del EPA no puede estar vacío' })
  @MaxLength(50, { message: 'El nombre del EPA no debe superar los 50 caracteres' })
  nombre_epa: string;

  @ApiProperty({
    description: 'Descripción del EPA (máximo 200 caracteres)',
    example: 'sigatoga negra enmcontrada en el cacao',
  })
  @IsString({ message: 'La descripción del EPA debe ser texto' })
  @IsNotEmpty({ message: 'La descripción del EPA no puede estar vacía' })
  @MaxLength(200, { message: 'La descripción del EPA no debe superar los 200 caracteres' })
  descripcion_epa: string;

  @ApiProperty({
    description: 'Estado del EPA',
    example: 'presente',
  })
  @IsEnum(EstadoEpaEnum, { message: 'El estado debe ser "presente" o "ausente"' })
  estado: EstadoEpaEnum;

  @IsNumber({}, { message: 'El ID del tipo EPA debe ser numérico' })
  @IsNotEmpty({ message: 'Debe especificar el tipo de EPA' })
  id_tipo_epa_fk: number;
}