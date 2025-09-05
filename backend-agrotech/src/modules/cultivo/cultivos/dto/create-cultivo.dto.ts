import {
  IsString,
  IsNumber,
  IsDateString,
  IsPositive,
  IsNotEmpty,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCultivoDto {
  // Descripción del cultivo (ej. "Alguna variedad del cacao")

  @ApiProperty({
    description: 'Descripción del cultivo (ejemplo: variedad, detalles, etc.)',
    example: 'Cacao fino de aroma',
  })

  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La descripción del cultivo es obligatoria.' })
  @MinLength(3, { message: 'La descripción debe tener al menos 3 caracteres.' })
  descripcion_cultivo: string;

  // Precio del cultivo (número positivo)

  @ApiProperty({
    description: 'Precio del cultivo',
    example: '50000'
  })
  @IsNumber({}, { message: 'El precio debe ser un número.' })
  @IsPositive({ message: 'El precio debe ser mayor que cero.' })
  precio_cultivo: number;

  // Presentación del cultivo (ej. "Saco de 50 kg")
    @ApiProperty({
    description: 'Presentacion del cultivo',
    example: 'saco de 50kg'
  })
  @IsString({ message: 'La presentación debe ser texto.' })
  @IsNotEmpty({ message: 'La presentación del cultivo es obligatoria.' })
  presentacion_cultivo: string;

  /*
      Fecha de inicio del cultivo.
      Debe estar en formato ISO (YYYY-MM-DD) para que pueda ser interpretada correctamente.
    */
  
  @ApiProperty({
    description: 'Fecha de inicio del cultivo en formato ISO (YYYY-MM-DD)',
    example: '2025-03-15',
  })
  @IsDateString(
    {},
    { message: 'La fecha de inicio debe tener formato válido (YYYY-MM-DD).' },
  )
  fecha_inicio_cultivo: Date;

  /*
      Fecha estimada de finalización del cultivo.
      Se valida como string en formato de fecha ISO.
    */

  @ApiProperty({
    description: 'Fecha estimada de finalización del cultivo en formato ISO (YYYY-MM-DD)',
    example: '2025-07-30',
  })
  @IsDateString(
    {},
    { message: 'La fecha de fin debe tener formato válido (YYYY-MM-DD).' },
  )
  fecha_fin_cultivo: Date;

  // ID del sublote relacionado (llave foránea)
   @ApiProperty({
    description: 'ID del sublote relacionado (llave foránea)',
    example: 3,
  })
  @IsNumber({}, { message: 'El ID del sublote debe ser un número.' })
  @IsPositive({ message: 'El ID del sublote debe ser mayor que cero.' })
  id_sublote_fk: number;

  // ID del tipo de cultivo (llave foránea)
  @ApiProperty({
    description: 'ID del tipo de cultivo (llave foránea)',
    example: 2,
  })
  @IsNumber({}, { message: 'El ID del tipo de cultivo debe ser un número.' })
  @IsPositive({ message: 'El ID del tipo de cultivo debe ser mayor que cero.' })
  id_tipo_cultivo_fk: number;
}
