import { IsNotEmpty, IsString, IsNumber, IsDate } from 'class-validator';

export class CreateProductoDto {
  @IsNotEmpty({ message: 'El nombre del producto es obligatorio' })
  @IsString({ message: 'El nombre del producto debe ser una cadena de texto' })
  nombre_producto: string;

  @IsNotEmpty({ message: 'La descripción del producto es obligatoria' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion_producto: string;

  @IsNotEmpty({ message: 'El precio del producto es obligatorio' })
  @IsNumber({}, { message: 'El precio debe ser un número' })
  precio_producto: number;

  @IsNotEmpty({ message: 'El stock del producto es obligatorio' })
  @IsNumber({}, { message: 'El stock debe ser un número entero' })
  stock_producto: number;

  @IsNotEmpty({ message: 'La fecha de ingreso es obligatoria' })
  @IsDate({ message: 'La fecha de ingreso debe tener formato de fecha y hora' })
  fecha_ingreso_producto: Date;

  @IsNotEmpty({ message: 'La fecha de caducidad es obligatoria' })
  @IsDate({ message: 'La fecha de caducidad debe tener formato de fecha' })
  fecha_caducidad_producto: Date;
}