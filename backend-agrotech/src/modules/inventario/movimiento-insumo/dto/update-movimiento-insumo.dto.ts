import { PartialType } from '@nestjs/swagger';
import { CreateMovimientoInsumoDto } from './create-movimiento-insumo.dto';

export class UpdateMovimientoInsumoDto extends PartialType(CreateMovimientoInsumoDto) {}
