import {
  IsNumber,
  IsInt,
  IsString,
  IsDateString,
  IsOptional,
} from 'class-validator';

/*
  DTO para crear un nuevo insumo.
  Valida tipo y formato de los campos.
*/
export class CreateInsumoDto {
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'El costo debe ser un número válido' })
  costo: number;

  @IsInt({ message: 'El stock debe ser un número entero' })
  stock: number;

  @IsString({ message: 'La unidad de medida debe ser una cadena de texto' })
  unidad_medida: string;

  @IsDateString({},{ message: 'La fecha de ingreso debe ser una fecha válida' })
  fecha_ingreso: string;

  @IsOptional()
  @IsDateString({},{ message: 'La fecha de salida debe ser una fecha válida' })
  fecha_salida?: string;

  @IsOptional()
  @IsDateString({},{ message: 'La fecha de vencimiento debe ser una fecha válida' })
  fecha_vencimiento?: string;

  @IsInt({ message: 'El id_almacen_fk debe ser un número entero' })
  id_almacen_fk: number;

  @IsInt({ message: 'El id_categoria_fk debe ser un número entero' })
  id_categoria_fk: number;
  
}