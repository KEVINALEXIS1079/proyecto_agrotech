import { PartialType } from '@nestjs/swagger';
import { CreateMovimientoProductoDto } from './create-movimiento-producto.dto';

export class UpdateMovimientoProductoDto extends PartialType(CreateMovimientoProductoDto) {}
