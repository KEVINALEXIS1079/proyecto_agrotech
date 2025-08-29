import { IsString, IsDateString, IsInt, IsPositive } from 'class-validator';

export class CreateSensoreDto {
  @IsString({ message: 'El nombre del sensor debe ser texto' })
  nombre_sensor: string;

  @IsDateString({}, { message: 'La fecha de instalación debe ser una fecha válida, con formato Año/Mes/dia' })
  fecha_inicio_sensor: string;

  @IsDateString({}, { message: 'La fecha de fin debe ser una fecha válida, con formato Año/Mes/dia' })
  fecha_fin_sensor: string;

  @IsInt({ message: 'El id del cultivo debe ser un número entero' })
  @IsPositive()
  id_cultivo_fk: number;

  @IsInt({ message: 'El id del tipo de sensor debe ser un número entero' })
  @IsPositive()
  id_tipo_sensor_fk: number;
}