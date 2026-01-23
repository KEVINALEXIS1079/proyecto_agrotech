// src/actividades/dto/update-actividades.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateActividadDto } from './create-actividad.dto';

/*
Esta clase extiende de CreateActividadesDto para permitir la actualización
de una actividad. Utiliza PartialType para hacer que todos los campos sean opcionales.   
*/
export class UpdateActividadDto extends PartialType(CreateActividadDto) {}