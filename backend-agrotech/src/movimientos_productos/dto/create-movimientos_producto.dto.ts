export class CreateMovimientosProductoDto {}
import { IsEnum, IsNotEmpty, IsNumber, IsString, IsDate } from 'class-validator';
import { TipoMovimiento } from '../entities/movimientos_producto.entity';

export class CreateMovimientosProductosDto {
  @IsNumber()
  @IsNotEmpty({ message: 'El producto es obligatorio' })
  id_producto_fk: number;

  @IsEnum(TipoMovimiento, { message: 'El tipo de movimiento debe ser entrada o salida' })
  tipo_movimiento: TipoMovimiento;

  @IsNumber()
  @IsNotEmpty({ message: 'La cantidad es obligatoria' })
  cantida: number;

  @IsDate()
  @IsNotEmpty({ message: 'La fecha es obligatoria' })
  fecha: Date;

  @IsString()
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  descripcion: string;
}