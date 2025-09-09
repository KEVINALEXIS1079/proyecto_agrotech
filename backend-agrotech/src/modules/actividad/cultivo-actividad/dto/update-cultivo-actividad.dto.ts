import { PartialType } from '@nestjs/swagger';
import { CreateCultivoActividadDto } from './create-cultivo-actividad.dto';

export class UpdateCultivoActividadDto extends PartialType(CreateCultivoActividadDto) {}
