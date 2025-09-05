import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { estado_usuario } from '../entities/usuario.entity';

export class CreateUsuarioDto {
  @ApiProperty({
    description: 'Cédula del usuario (números entre 6 y 15 dígitos)',
    examples: ['123456', '9876543210'], 
  })
  @IsString({ message: 'La cedula debe ser una cadena numerica' })
  @Matches(/^[0-9]+$/, { message: 'La cedula solo debe contener numeros' })
  @Length(6, 15, { message: 'La cedula debe tener entre 6 y 15 dígitos' })
  cedula_usuario: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    examples: ['Andrés', 'María'],
  })
  @IsString({ message: 'El nombre del usuario debe ser texto' })
  @MaxLength(30, { message: 'El nombre no debe superar los 30 caracteres' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacio' })
  nombre_usuario: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    examples: ['Escobar', 'García'],
  })
  @IsString({ message: 'El apellido del usuario debe ser texto' })
  @MaxLength(30, { message: 'El apellido no debe superar los 30 caracteres' })
  @IsNotEmpty({ message: 'El apellido no puede estar vacio' })
  apellido_usuario: string;

  @ApiProperty({
    description: 'Teléfono del usuario (10 dígitos)',
    examples: ['3001234567', '3109876543'],
  })
  @IsString({ message: 'El telefono debe ser una cadena numerica' })
  @Length(10, 10, { message: 'El numero debe tener exactamente 10 digitos' })
  @Matches(/^[0-9]+$/, { message: 'El teléfono solo debe contener numeros' })
  telefono_usuario: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    examples: ['usuario@mail.com', 'test@example.org'],
  })
  @IsEmail({}, { message: 'Debe ser un correo electrónico valido' })
  @MaxLength(100, { message: 'El correo no debe superar los 100 caracteres' })
  correo_usuario: string;

  @ApiProperty({
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
    examples: ['clave123', 'P@ssw0rd!'],
  })
  @IsString({ message: 'La contraseña debe ser texto' })
  @Length(6, 50, { message: 'La contraseña debe tener entre 6 y 50 caracteres' })
  contrasena_usuario: string;

  @ApiProperty({
    description: 'Estado del usuario',
    enum: estado_usuario,
    examples: ['ACTIVO', 'INACTIVO'],
  })
  @IsEnum(estado_usuario, { message: 'El estado debe ser ACTIVO o INACTIVO' })
  estado_usuario: estado_usuario;

  @ApiProperty({
    description: 'ID del rol asociado al usuario',
    examples: [1, 2],
  })
  @IsInt({ message: 'El ID de rol debe ser numerico' })
  @IsNotEmpty({ message: 'Debe indicar el rol del usuario' })
  id_rol_fk: number;
}
