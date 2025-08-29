import { PartialType } from '@nestjs/mapped-types';
import { CreateTiposEpaDto } from './create-tipos_epa.dto';

export class UpdateTiposEpaDto extends PartialType(CreateTiposEpaDto) {}