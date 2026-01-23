import { PartialType } from '@nestjs/swagger';
import { CreateInsumoDto } from './create-insumo.dto';

/*
  Extiende CreateInsumoDto para actualizar insumos.
  Todos los campos son opcionales.
*/
export class UpdateInsumoDto extends PartialType(CreateInsumoDto) {}
