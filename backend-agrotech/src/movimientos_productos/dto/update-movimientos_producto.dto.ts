import { PartialType } from '@nestjs/mapped-types';
import { CreateMovimientosProductosDto } from './create-movimientos_producto.dto';

export class UpdateMovimientosProductosDto extends PartialType(CreateMovimientosProductosDto) {}