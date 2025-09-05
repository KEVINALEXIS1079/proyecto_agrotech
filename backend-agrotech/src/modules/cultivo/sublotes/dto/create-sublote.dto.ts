import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubloteDto {
  // Latitud geográfica del sublote (número decimal)
   @ApiProperty({
    description: 'Latitud del sublote (número decimal).',
    example: 6.25,
  })
  @IsNumber({}, { message: 'La latitud del sublote debe ser un número.' })
  latitud_sublote: number;

  // Longitud geográfica del sublote (número decimal)
  @ApiProperty({
    description: 'Longitud  del sublote (número decimal).',
    example: 5.56,
  })
  @IsNumber({}, { message: 'La longitud del sublote debe ser un número.' })
  longitud_sublote: number;

  // Nombre identificador del sublote
  @ApiProperty({
    description: 'Nombre del sublote.',
    example: 'Cacao 2',
  })
  @IsString({ message: 'El nombre del sublote debe ser una cadena de texto.' })
  nombre_sublote: string;

  // Descripción general del sublote
  @ApiProperty({
    description: 'Descripción general del sublote.',
    example: 'Sublote destinado a cultivo de cacao',
  })
  @IsString({
    message: 'La descripción del sublote debe ser una cadena de texto.',
  })
  descripcion_sublote: string;

  // Clave foránea que relaciona el sublote con un lote específico
  @ApiProperty({
    description: 'llave foránea del lote',
    example: 3,
  })
  @IsNumber({}, { message: 'El ID del lote debe ser un número.' })
  id_lote_fk: number;
}
