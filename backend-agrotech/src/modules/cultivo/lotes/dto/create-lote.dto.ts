import { IsNumber, Min, IsArray, ValidateNested, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class CoordenadaLoteDto {
  @ApiProperty({ description: 'Latitud del punto del lote', example: 4.611 })
  @IsNumber({}, { message: 'La latitud_lote debe ser un número' })
  latitud_lote: number;

  @ApiProperty({ description: 'Longitud del punto del lote', example: -74.082 })
  @IsNumber({}, { message: 'La longitud_lote debe ser un número' })
  longitud_lote: number;
}

export class CreateLoteDto {
  /*
  Nombre identificador del lote
  */
  @ApiProperty({ description: 'Nombre del lote', example: 'Bloque A' })
  @IsString({ message: 'El nombre del lote debe ser un texto' })
  @Length(1, 100, { message: 'El nombre debe tener entre 1 y 100 caracteres' })
  nombre_lote: string;

  /*
  Área total del lote en metros cuadrados.
  Debe ser un número positivo mayor a cero.
  */
  @ApiProperty({
    description: 'Área total del lote en metros cuadrados',
    example: 120,
  })
  @IsNumber({}, { message: 'El área del lote debe ser un número' })
  @Min(1, { message: 'El área del lote debe ser mayor a cero' })
  area_lote: number;

  /*
  Array de coordenadas que definen el polígono del lote.
  Cada punto tiene latitud_lote y longitud_lote.
  */
  @ApiProperty({
    description: 'Polígono del lote como array de coordenadas',
    type: [CoordenadaLoteDto],
    example: [
      { latitud_lote: 4.611, longitud_lote: -74.082 },
      { latitud_lote: 4.611, longitud_lote: -74.081 },
      { latitud_lote: 4.610, longitud_lote: -74.081 },
      { latitud_lote: 4.610, longitud_lote: -74.082 },
    ],
  })
  @IsArray({ message: 'coordenadas_lote debe ser un array' })
  @ValidateNested({ each: true })
  @Type(() => CoordenadaLoteDto)
  coordenadas_lote: CoordenadaLoteDto[];
}
