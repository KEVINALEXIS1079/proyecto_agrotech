import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  Length,
  IsOptional
} from 'class-validator';
import { EstadoUsuario } from '../enums/estado-usuario.enum';
import { ApiProperty } from '@nestjs/swagger';

export class RegistrarUsuarioPublicDTO {
  @ApiProperty({
    description: 'Cédula del usuario (números entre 6 y 15 dígitos)',
    example: '1234567890',
  })
  @IsString({ message: 'La cédula debe ser una cadena numérica' })
  @Matches(/^[0-9]+$/, { message: 'La cédula solo debe contener números' })
  @Length(6, 15, { message: 'La cédula debe tener entre 6 y 15 dígitos' })
  cedula_usuario: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'María',
  })
  @IsString({ message: 'El nombre del usuario debe ser texto' })
  @MaxLength(30, { message: 'El nombre no debe superar los 30 caracteres' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  nombre_usuario: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Rojas',
  })
  @IsString({ message: 'El apellido del usuario debe ser texto' })
  @MaxLength(30, { message: 'El apellido no debe superar los 30 caracteres' })
  @IsNotEmpty({ message: 'El apellido no puede estar vacío' })
  apellido_usuario: string;

  @ApiProperty({
    description: 'Teléfono del usuario (10 dígitos)',
    example: '3205874152',
  })
  @IsString({ message: 'El teléfono debe ser una cadena numérica' })
  @Length(10, 10, { message: 'El número debe tener exactamente 10 dígitos' })
  @Matches(/^[0-9]+$/, { message: 'El teléfono solo debe contener números' })
  telefono_usuario: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@gmail.com',
  })
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  @MaxLength(100, { message: 'El correo no debe superar los 100 caracteres' })
  correo_usuario: string;

  @ApiProperty({
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
    example: 'clave123',
  })
  @IsString({ message: 'La contraseña debe ser texto' })
  @Length(6, 50, { message: 'La contraseña debe tener entre 6 y 50 caracteres' })
  contrasena_usuario: string;

    @ApiProperty({
    description: 'Imagen del usuario (URL o ruta)',
    example: 'uploads/usuarios/avatar.png',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La imagen debe ser texto (ruta o URL)' })
  img_usuario?: string | null;

  @ApiProperty({
    description:
      'Estado del usuario (por defecto se crea como activo al registrarse públicamente)',
    enum: EstadoUsuario,
    example: EstadoUsuario.ACTIVO,
    default: EstadoUsuario.ACTIVO,
  })
  @IsEnum(EstadoUsuario, { message: 'El estado debe ser activo o inactivo' })
  estado_usuario: EstadoUsuario = EstadoUsuario.ACTIVO;
}
