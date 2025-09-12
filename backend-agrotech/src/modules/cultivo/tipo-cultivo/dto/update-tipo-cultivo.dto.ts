import { PartialType } from '@nestjs/swagger';
import { CreateTipoCultivoDto } from './create-tipo-cultivo.dto';

/*
  Esta clase hereda todos los campos de CreateTipoCultivoDto,
  pero los convierte en opcionales usando PartialType.
  
  Esto es útil para las operaciones de actualización (PUT/PATCH),
  donde no es obligatorio enviar todos los campos.
*/
export class UpdateTipoCultivoDto extends PartialType(CreateTipoCultivoDto) {}
