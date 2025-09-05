import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCultivoActividadDto {
  @ApiProperty({
    description: 'Identificador del cultivo (relación con tabla cultivo)',
    example: 5,
  })
  @IsInt({ message: 'El id del cultivo debe ser un número entero' })
  @IsPositive({ message: 'El id del cultivo debe ser mayor que 0' })
  id_cultivo_fk: number;

  @ApiProperty({
    description: 'Identificador de la actividad (relación con tabla actividades)',
    example: 12,
  })
  @IsInt({ message: 'El id de la actividad debe ser un número entero' })
  @IsPositive({ message: 'El id de la actividad debe ser mayor que 0' })
  id_actividad_fk: number;
}
