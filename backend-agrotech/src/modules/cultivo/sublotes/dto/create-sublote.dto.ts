import { IsNumber, Min, IsArray, ValidateNested, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class CoordenadaSubloteDto {
  @ApiProperty({ description: 'Latitud del punto del sublote', example: 4.611 })
  @IsNumber({}, { message: 'La latitud_sublote debe ser un número' })
  latitud_sublote: number;

  @ApiProperty({ description: 'Longitud del punto del sublote', example: -74.082 })
  @IsNumber({}, { message: 'La longitud_sublote debe ser un número' })
  longitud_sublote: number;
}

export class CreateSubloteDto {
  /*
  Nombre identificador del sublote
  */
  @ApiProperty({ description: 'Nombre del sublote', example: 'Bloque A' })
  @IsString({ message: 'El nombre del sublote debe ser un texto' })
  @Length(1, 100, { message: 'El nombre debe tener entre 1 y 100 caracteres' })
  nombre_sublote: string;

  /*
  Área total del sublote en metros cuadrados.
  Debe ser un número positivo mayor a cero.
  */
  @ApiProperty({
    description: 'Área total del sublote en metros cuadrados',
    example: 120,
  })
  @IsNumber({}, { message: 'El área del sublote debe ser un número' })
  @Min(1, { message: 'El área del sublote debe ser mayor a cero' })
  area_sublote: number;

  /*
  Array de coordenadas que definen el polígono del sublote.
  Cada punto tiene latitud_sublote y longitud_sublote.
  */
  @ApiProperty({
    description: 'Polígono del sublote como array de coordenadas',
    type: [CoordenadaSubloteDto],
    example: [
      { latitud_sublote: 4.611, longitud_sublote: -74.082 },
      { latitud_sublote: 4.611, longitud_sublote: -74.081 },
      { latitud_sublote: 4.610, longitud_sublote: -74.081 },
      { latitud_sublote: 4.610, longitud_sublote: -74.082 },
    ],
  })
  @IsArray({ message: 'coordenadas_sublote debe ser un array' })
  @ValidateNested({ each: true })
  @Type(() => CoordenadaSubloteDto)
  coordenadas_sublote: CoordenadaSubloteDto[];

  // Clave foránea que relaciona el sublote con un lote específico
  @ApiProperty({
    description: 'llave foránea del lote',
    example: 3,
  })
  @IsNumber({}, { message: 'El ID del lote debe ser un número.' })
  id_lote_fk: number;
}
