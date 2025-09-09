import {
  IsString,
  IsNumber,
  IsDateString,
  IsPositive,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCultivoDto {
  @ApiProperty({
    description: 'Nombre del cultivo',
    example: 'Plátano',
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre del cultivo es obligatorio.' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
  @MaxLength(100, { message: 'El nombre no debe exceder 100 caracteres.' })
  nombre_cultivo: string;

  @ApiProperty({
    description: 'Descripción del cultivo',
    example: 'Cacao fino de aroma',
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La descripción es obligatoria.' })
  @MinLength(3, { message: 'La descripción debe tener al menos 3 caracteres.' })
  descripcion_cultivo: string;

  @ApiProperty({
    description: 'URL de la imagen del cultivo',
    example: 'img/mi-servidor.com/imagenes/cacao.jpg',
  })
  @IsString({ message: 'La imagen debe ser una URL válida.' })
  @IsNotEmpty({ message: 'La imagen del cultivo es obligatoria.' })
  img_cultivo: string;

  @ApiProperty({
    description: 'Estado del cultivo',
    example: 'activo',
  })
  @IsString({ message: 'El estado debe ser texto.' })
  @IsNotEmpty({ message: 'El estado del cultivo es obligatorio.' })
  estado_cultivo: string;

  @ApiProperty({
    description: 'Fecha de inicio del cultivo en formato ISO (YYYY-MM-DD)',
    example: '2025-03-15',
  })
  @IsDateString({}, { message: 'La fecha de inicio debe tener formato válido (YYYY-MM-DD).' })
  fecha_inicio_cultivo: Date;

  @ApiProperty({
    description: 'Fecha de fin del cultivo en formato ISO (YYYY-MM-DD)',
    example: '2025-07-30',
  })
  @IsDateString({}, { message: 'La fecha de fin debe tener formato válido (YYYY-MM-DD).' })
  fecha_fin_cultivo: Date;

  @ApiProperty({
    description: 'ID del sublote relacionado (llave foránea)',
    example: 3,
  })
  @IsNumber({}, { message: 'El ID del sublote debe ser un número.' })
  @IsPositive({ message: 'El ID del sublote debe ser mayor que cero.' })
  id_sublote_fk: number;

  @ApiProperty({
    description: 'ID del tipo de cultivo (llave foránea)',
    example: 2,
  })
  @IsNumber({}, { message: 'El ID del tipo de cultivo debe ser un número.' })
  @IsPositive({ message: 'El ID del tipo de cultivo debe ser mayor que cero.' })
  id_tipo_cultivo_fk: number;
}
