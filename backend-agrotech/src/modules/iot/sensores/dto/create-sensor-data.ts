// src/modules/iot/sensores/dto/create-sensor-data.dto.ts
import { IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateSensorDataDto {
  @IsNumber()
  id_sensor: number; // ID del sensor que envía el dato

  @IsNumber()
  valor: number;     // valor medido

  @IsOptional()
  @IsDateString()
  timestamp?: string; // fecha de la medición (opcional, si no se envía se toma la actual)
}
