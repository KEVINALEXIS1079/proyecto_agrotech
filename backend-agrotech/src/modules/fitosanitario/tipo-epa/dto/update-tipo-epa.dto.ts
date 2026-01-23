import { PartialType } from '@nestjs/swagger';
import { CreateTipoEpaDto } from './create-tipo-epa.dto';

export class UpdateTipoEpaDto extends PartialType(CreateTipoEpaDto) {}