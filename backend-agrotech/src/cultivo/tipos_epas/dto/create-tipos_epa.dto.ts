import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { TipoEpaEnum } from '../entities/tipos_epa.entity';

export class CreateTiposEpaDto {
  @IsString({ message: 'El nombre del tipo de EPA debe ser texto' })
  @IsNotEmpty({ message: 'El nombre del tipo de EPA no puede estar vacío' })
  @MaxLength(50, { message: 'El nombre no debe superar los 50 caracteres' })
  nombre_tipo_epa: string;

  @IsString({ message: 'La descripción del tipo de EPA debe ser texto' })
  @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
  @MaxLength(200, { message: 'La descripción no debe superar los 200 caracteres' })
  descripcion: string;

  @IsEnum(TipoEpaEnum, { message: 'El tipo debe ser "enfermedad", "plaga" o "arvense"' })
  tipo_epa_enum: TipoEpaEnum;
}