import { PartialType } from '@nestjs/swagger';
import { CreateUsuarioActividadDto } from './create-usuario-actividad.dto';

export class UpdateUsuarioActividadDto extends PartialType(CreateUsuarioActividadDto) {}
