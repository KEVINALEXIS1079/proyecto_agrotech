import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCategoriaDto {
  @IsString({ message: 'El nombre de la categoría debe ser texto' })
  @IsNotEmpty({ message: 'El nombre de la categoría no puede estar vacío' })
  @MaxLength(50, { message: 'El nombre de la categoría no debe superar los 50 caracteres' })
  nombre_categoria: string;

  @IsString({ message: 'La descripción de la categoría debe ser texto' })
  @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
  @MaxLength(150, { message: 'La descripción no debe superar los 150 caracteres' })
  descripcion_categoria: string;
}