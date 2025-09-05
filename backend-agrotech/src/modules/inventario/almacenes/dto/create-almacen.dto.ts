import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAlmacenDto {
  @ApiProperty({
    description: 'Nombre del almacén',
    examples: ['Almacén Central', 'Depósito Norte', 'Bodega Principal'],
    maxLength: 50,
  })
  @IsString({ message: 'El nombre del almacén debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre del almacén no puede estar vacío' })
  @MaxLength(50, { message: 'El nombre del almacén no debe superar los 50 caracteres' })
  nombre_almacen: string;
}
