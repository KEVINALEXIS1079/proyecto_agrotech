import { PartialType } from '@nestjs/swagger';
import { CreateTipoActividadDto } from './create-tipo-actividad.dto';

export class UpdateTipoActividadDto extends PartialType(CreateTipoActividadDto) {}
