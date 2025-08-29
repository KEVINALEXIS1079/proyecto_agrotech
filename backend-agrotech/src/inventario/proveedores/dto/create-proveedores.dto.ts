import { IsOptional, IsString, IsEmail, Length } from 'class-validator';

/*
  DTO para crear un nuevo proveedor.
  Contiene validaciones básicas de tipo y longitud.
*/
export class CreateProveedoresDto {
  // Nombre del proveedor
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Length(1, 100, { message: 'El nombre debe tener entre 1 y 100 caracteres' })
  nombre_proveedor: string;

  // Dirección del proveedor
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @Length(1, 150, { message: 'La dirección debe tener entre 1 y 150 caracteres' })
  direccion_proveedor: string;

  // Correo electrónico del proveedor
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  @Length(1, 100, { message: 'El email debe tener entre 1 y 100 caracteres' })
  email_proveedor: string;

  // Número de teléfono del proveedor (opcional)
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @Length(0, 50, { message: 'El teléfono debe tener como máximo 50 caracteres' })
  telefono_proveedor?: string | null;
}
