import { PartialType } from '@nestjs/mapped-types';
import { CreateMovimientoInsumoDto } from './create-movimiento_insumo.dto';

export class UpdateMovimientoInsumoDto extends PartialType(CreateMovimientoInsumoDto) {}
