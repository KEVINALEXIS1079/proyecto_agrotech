import { PartialType } from '@nestjs/swagger';
import { CreateEpaDto } from './create-epa.dto';

export class UpdateEpaDto extends PartialType(CreateEpaDto) {}