import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoriaDto {
  @ApiProperty({
    description: 'Nombre de la categoría',
    examples: ['Fertilizantes', 'Herramientas', 'Semillas'],
    maxLength: 50,
  })
  @IsString({ message: 'El nombre de la categoría debe ser texto' })
  @IsNotEmpty({ message: 'El nombre de la categoría no puede estar vacío' })
  @MaxLength(50, { message: 'El nombre de la categoría no debe superar los 50 caracteres' })
  nombre_categoria: string;

  @ApiProperty({
    description: 'Descripción de la categoría',
    examples: [
      'Productos utilizados para mejorar el rendimiento del cultivo',
      'Herramientas agrícolas para el mantenimiento de los lotes',
      'Diferentes variedades de semillas para la siembra',
    ],
    maxLength: 150,
  })
  @IsString({ message: 'La descripción de la categoría debe ser texto' })
  @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
  @MaxLength(150, { message: 'La descripción no debe superar los 150 caracteres' })
  descripcion_categoria: string;
}
