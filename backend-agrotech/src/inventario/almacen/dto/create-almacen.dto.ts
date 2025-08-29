import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateAlmacenDto {
  @IsString({ message: 'El nombre del almacén debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre del almacén no puede estar vacío' })
  @MaxLength(50, { message: 'El nombre del almacén no debe superar los 50 caracteres' })
  nombre_almacen: string;
}