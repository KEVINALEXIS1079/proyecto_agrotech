import { IsNumber, IsString } from 'class-validator';

export class CreateSubloteDto {
  // Latitud geográfica del sublote (número decimal)
  @IsNumber({}, { message: 'La latitud del sublote debe ser un número.' })
  latitud_sublote: number;

  // Longitud geográfica del sublote (número decimal)
  @IsNumber({}, { message: 'La longitud del sublote debe ser un número.' })
  longitud_sublote: number;

  // Nombre identificador del sublote
  @IsString({ message: 'El nombre del sublote debe ser una cadena de texto.' })
  nombre_sublote: string;

  // Descripción general del sublote
  @IsString({
    message: 'La descripción del sublote debe ser una cadena de texto.',
  })
  descripcion_sublote: string;

  // Clave foránea que relaciona el sublote con un lote específico
  @IsNumber({}, { message: 'El ID del lote debe ser un número.' })
  id_lote_fk: number;
}
