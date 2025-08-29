import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioActividadDto } from './create-usuario_actividad.dto';

export class UpdateUsuarioActividadDto extends PartialType(CreateUsuarioActividadDto) {}
