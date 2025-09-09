import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTipoSensorDto {
  @ApiProperty({
    description: 'Nombre del tipo de sensor',
    examples: ['Humedad', 'Temperatura', 'pH', 'Luminosidad'],
  })
  @IsString({ message: 'El nombre del tipo de sensor debe ser texto' })
  @IsNotEmpty({ message: 'El nombre del tipo de sensor no puede estar vacío' })
  nombre_tipo_sensor: string;
}
