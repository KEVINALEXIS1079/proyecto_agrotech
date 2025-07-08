import { IsNumber, Min } from 'class-validator';

export class CreateLoteDto {
/*
Área total del lote en metros cuadrados.
Debe ser un número positivo mayor a cero.
*/
  @IsNumber({}, { message: 'El área del lote debe ser un número' })
  @Min(1, { message: 'El área del lote debe ser mayor a cero' })
  area_lote: number;
}
