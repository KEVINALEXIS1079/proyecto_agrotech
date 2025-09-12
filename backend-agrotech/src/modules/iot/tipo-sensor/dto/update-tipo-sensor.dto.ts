import { PartialType } from '@nestjs/swagger';
import { CreateTipoSensorDto } from './create-tipo-sensor.dto';

export class UpdateTipoSensorDto extends PartialType(CreateTipoSensorDto) {}
