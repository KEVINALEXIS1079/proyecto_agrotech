import { PartialType } from '@nestjs/mapped-types';
import { CreateCultivosActividadesDto } from './create-cultivos_actividade.dto';

export class UpdateCultivosActividadesDto extends PartialType(CreateCultivosActividadesDto) {}
