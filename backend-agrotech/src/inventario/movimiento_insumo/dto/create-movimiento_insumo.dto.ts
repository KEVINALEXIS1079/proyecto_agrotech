import { IsInt, IsNotEmpty, IsOptional, IsString, IsDate } from 'class-validator';

export class CreateMovimientoInsumoDto {
  @IsInt()
  id_insumo_fk: number;

  @IsString()
  @IsNotEmpty()
  tipo_movimiento: string;

  @IsInt()
  cantidad: number;

  @IsString()
  unidad: string;

  @IsDate()
  fecha_movimiento: Date;

  @IsString()
  motivo: string;

  @IsOptional()
  @IsInt()
  id_actividad_fk?: number;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
