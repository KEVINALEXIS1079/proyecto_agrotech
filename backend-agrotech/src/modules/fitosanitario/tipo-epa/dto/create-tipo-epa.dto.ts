import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TipoEpaEnum } from '../entities/tipo-epa.entity';

export class CreateTipoEpaDto {
  @ApiProperty({
    description: 'Nombre del tipo de EPA',
    example: 'Gusano Cogollero',
    maxLength: 50,
  })
  @IsString({ message: 'El nombre del tipo de EPA debe ser texto' })
  @IsNotEmpty({ message: 'El nombre del tipo de EPA no puede estar vacío' })
  @MaxLength(50, { message: 'El nombre no debe superar los 50 caracteres' })
  nombre_tipo_epa: string;

  @ApiProperty({
    description: 'Descripción del tipo de EPA',
    example: 'Plaga que afecta las hojas del cultivo de cacao',
    maxLength: 200,
  })
  @IsString({ message: 'La descripción del tipo de EPA debe ser texto' })
  @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
  @MaxLength(200, { message: 'La descripción no debe superar los 200 caracteres' })
  descripcion: string;

  @ApiProperty({
    description: 'Tipo de EPA (clasificación)',
    example: 'plaga',
    enum: TipoEpaEnum,
  })
  @IsEnum(TipoEpaEnum, { message: 'El tipo debe ser "enfermedad", "plaga" o "arvense"' })
  tipo_epa_enum: TipoEpaEnum;
}
