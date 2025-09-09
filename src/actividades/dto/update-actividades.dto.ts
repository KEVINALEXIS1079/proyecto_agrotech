// src/actividades/dto/update-actividades.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateActividadesDto } from './create-actividades.dto';

/*
Esta clase extiende de CreateActividadesDto para permitir la actualización
de una actividad. Utiliza PartialType para hacer que todos los campos sean opcionales.   
*/
export class UpdateActividadesDto extends PartialType(CreateActividadesDto) {}