import { PartialType } from '@nestjs/mapped-types';
import { CreateCultivoDto } from './create-cultivo.dto';

/*
  Esta clase hereda todos los campos de CreateCultivoDto,
  pero los convierte en opcionales usando PartialType.
  
  Esto es útil para las operaciones de actualización (PUT/PATCH),
  donde no es obligatorio enviar todos los campos.
*/
export class UpdateCultivoDto extends PartialType(CreateCultivoDto) {}
