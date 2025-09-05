import { IsNotEmpty, IsDate, IsString, MaxLength, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEvidenciaDto {
  @ApiProperty({
    description: 'Nombre de la evidencia',
    example: 'Registro fotográfico de la poda',
    maxLength: 255,
  })
  @IsString({ message: 'El nombre de la evidencia debe ser texto' })
  @IsNotEmpty({ message: 'El nombre de la evidencia no puede estar vacío' })
  @MaxLength(255, { message: 'El nombre de la evidencia no puede exceder los 255 caracteres' })
  nombre_evidencia: string;

  @ApiProperty({
    description: 'Descripción de la evidencia',
    example: 'Fotografías que muestran el estado del cultivo después de la poda realizada en el lote 2',
    maxLength: 500,
  })
  @IsString({ message: 'La descripción de la evidencia debe ser texto' })
  @IsNotEmpty({ message: 'La descripción de la evidencia no puede estar vacía' })
  @MaxLength(500, { message: 'La descripción de la evidencia no puede exceder los 500 caracteres' })
  descripcion_evidencia: string;

  @ApiProperty({
    description: 'Fecha en que se registró la evidencia (formato YYYY-MM-DD)',
    example: '2025-09-05',
  })
  @Type(() => Date)
  @IsDate({ message: 'La fecha de la evidencia debe ser una fecha válida con formato Año/Mes/Día' })
  @IsNotEmpty({ message: 'La fecha de la evidencia no puede estar vacía' })
  fecha_evidencia: Date;

  @ApiProperty({
    description: 'Observaciones adicionales de la evidencia',
    example: 'El cultivo presenta un desarrollo saludable tras la poda',
    maxLength: 500,
  })
  @IsString({ message: 'La observación de la evidencia debe ser texto' })
  @IsNotEmpty({ message: 'La observación de la evidencia no puede estar vacía' })
  @MaxLength(500, { message: 'La observación de la evidencia no puede exceder los 500 caracteres' })
  observacion_evidencia: string;

  @ApiProperty({
    description: 'Fecha de inicio del registro de la evidencia (formato YYYY-MM-DD)',
    example: '2025-09-01',
  })
  @Type(() => Date)
  @IsDate({ message: 'La fecha de inicio de la evidencia debe ser una fecha válida con formato Año/Mes/Día' })
  @IsNotEmpty({ message: 'La fecha de inicio de la evidencia no puede estar vacía' })
  fecha_inicio_evidencia: Date;

  @ApiProperty({
    description: 'Fecha de fin del registro de la evidencia (formato YYYY-MM-DD)',
    example: '2025-09-04',
  })
  @Type(() => Date)
  @IsDate({ message: 'La fecha de fin de la evidencia debe ser una fecha válida con formato Año/Mes/Día' })
  @IsNotEmpty({ message: 'La fecha de fin de la evidencia no puede estar vacía' })
  fecha_fin_evidencia: Date;

  @ApiProperty({
    description: 'Identificador del cultivo al que pertenece la evidencia (relación con tabla cultivo)',
    example: 3,
  })
  @Type(() => Number)
  @IsInt({ message: 'El ID del cultivo debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID del cultivo no puede estar vacío' })
  id_cultivo_fk: number;
}
