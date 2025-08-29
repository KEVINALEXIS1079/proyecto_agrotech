import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTipoSensorDto {
    @IsString({ message: 'El nombre del tipo de sensor debe ser texto' })
    @IsNotEmpty({ message: 'El nombre del tipo de sensor no puede estar vacío' })
    nombre_tipo_sensor: string;
}