// src/modules/iot/sensores/dto/create-sensor.dto.ts
import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSensorDto {
  @IsString()
  nombre_sensor: string;

  @IsString()
  broker_sensor: string;

  @IsNumber()
  @Type(() => Number)
  puerto_sensor: number;

  @IsString()
  topico_sensor: string;

  @IsNumber()
  @Type(() => Number)
  valor_minimo_sensor: number;

  @IsNumber()
  @Type(() => Number)
  valor_maximo_sensor: number;

  @IsBoolean()
  @IsOptional()
  activo?: boolean = true;

  @IsNumber()
  @Type(() => Number)
  id_lote_fk: number;

  @IsNumber()
  @Type(() => Number)
  id_tipo_sensor_fk: number;
}
