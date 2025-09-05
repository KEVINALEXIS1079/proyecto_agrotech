import { IsOptional, IsString, IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/*
  DTO para crear un nuevo proveedor.
  Contiene validaciones básicas de tipo y longitud.
*/
export class CreateProveedorDto {
  // Nombre del proveedor
  @ApiProperty({
    description: 'Nombre del proveedor',
    examples: ['AgroInsumos S.A.', 'Proveedor Central', 'Distribuciones XYZ'],
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Length(1, 100, { message: 'El nombre debe tener entre 1 y 100 caracteres' })
  nombre_proveedor: string;

  // Dirección del proveedor
  @ApiProperty({
    description: 'Dirección física del proveedor',
    examples: ['Calle 123 #45-67', 'Av. Principal 1000', 'Zona Industrial, Bodega 5'],
  })
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @Length(1, 150, { message: 'La dirección debe tener entre 1 y 150 caracteres' })
  direccion_proveedor: string;

  // Correo electrónico del proveedor
  @ApiProperty({
    description: 'Correo electrónico del proveedor',
    examples: ['contacto@agroinsumos.com', 'ventas@xyz.com'],
  })
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  @Length(1, 100, { message: 'El email debe tener entre 1 y 100 caracteres' })
  email_proveedor: string;

  // Número de teléfono del proveedor (opcional)
  @ApiProperty({
    description: 'Teléfono de contacto del proveedor (opcional)',
    required: false,
    examples: ['3001234567', '3117654321'],
  })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @Length(0, 50, { message: 'El teléfono debe tener como máximo 50 caracteres' })
  telefono_proveedor?: string | null;
}
