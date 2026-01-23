import {
  IsInt, IsString, IsDateString, IsOptional, IsEnum,
  IsNumber, Min, MaxLength
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EstadoInsumo } from '../enums/estado-insumo.enum';
import { UnidadContenido, PresentacionInsumo } from '../enums/unidades.enum';

export class CreateInsumoDto {
  @ApiProperty({ example: 'Cemento gris 50 kg' })
  @IsString() @MaxLength(120)
  nombre: string;

  @ApiProperty({ enum: PresentacionInsumo, example: PresentacionInsumo.BULTO })
  @IsEnum(PresentacionInsumo)
  presentacion: PresentacionInsumo;

  @ApiProperty({ example: 50 })
  @IsNumber() @Min(0.001)
  contenido_por_unidad: number;

  @ApiProperty({ enum: UnidadContenido, example: UnidadContenido.KG })
  @IsEnum(UnidadContenido)
  unidad_contenido: UnidadContenido;

  @ApiProperty({ example: 20 })
  @IsInt() @Min(0)
  stock_unidades: number;

  @ApiProperty({ example: 0, required: false, description: 'Contenido suelto (p. ej., kg sueltos de bultos abiertos)' })
  @IsOptional() @IsNumber() @Min(0)
  stock_contenido_suelto?: number;

  @ApiProperty({ example: 20000 })
  @IsNumber() @Min(0)
  precio_presentacion: number;

  @ApiProperty({ enum: EstadoInsumo, required: false })
  @IsOptional() @IsEnum(EstadoInsumo)
  estado_insumo?: EstadoInsumo;

  @ApiProperty({ example: '2025-07-20' })
  @IsDateString()
  fecha_ingreso: string;

  @ApiProperty({ required: false }) @IsOptional() @IsDateString()
  fecha_salida?: string;

  @ApiProperty({ required: false }) @IsOptional() @IsDateString()
  fecha_vencimiento?: string;

  @ApiProperty({ example: 1 }) @IsInt()
  id_almacen_fk: number;

  @ApiProperty({ example: 2 }) @IsInt()
  id_categoria_fk: number;

  // Proveedor es opcional (solo lo mostramos en la card)
  @ApiProperty({ required: false, example: 5 })
  @IsOptional() @IsInt()
  id_proveedor_fk?: number;

  @ApiProperty({ required: false }) @IsOptional() @IsString() @MaxLength(300)
  img_url?: string;
}
