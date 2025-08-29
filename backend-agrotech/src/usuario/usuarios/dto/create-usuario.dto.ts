import {IsEmail, IsEnum, IsInt, IsNotEmpty, IsString, Matches, MaxLength, Length
} from 'class-validator';
import { estado_usuario } from '../entities/usuario.entity';

export class CreateUsuarioDto {
  @IsString({ message: 'La cedula debe ser una cadena numerica' })
  @Matches(/^[0-9]+$/, { message: 'La cedula solo debe contener numeros' })
  @Length(6, 15, { message: 'La cedula debe tener entre 6 y 15 dígitos' })
  cedula_usuario: string;

  @IsString({ message: 'El nombre del usuario debe ser texto' })
  @MaxLength(30, { message: 'El nombre no debe superar los 30 caracteres' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacio' })
  nombre_usuario: string;

  @IsString({ message: 'El apellido del usuario debe ser texto' })
  @MaxLength(30, { message: 'El apellido no debe superar los 30 caracteres' })
  @IsNotEmpty({ message: 'El apellido no puede estar vacio' })
  apellido_usuario: string;

  @IsString({ message: 'El telefono debe ser una cadena numerica' })
  @Length(10, 10, { message: 'El numero debe tener exactamente 10 digitos' })
  @Matches(/^[0-9]+$/, { message: 'El teléfono solo debe contener numeros' })
  telefono_usuario: string;

  @IsEmail({}, { message: 'Debe ser un correo electrónico valido' })
  @MaxLength(100, { message: 'El correo no debe superar los 100 caracteres' })
  correo_usuario: string;

  @IsString({ message: 'La contraseña debe ser texto' })
  @Length(6, 50, { message: 'La contraseña debe tener entre 6 y 50 caracteres' })
  contrasena_usuario: string;

  @IsEnum(estado_usuario, { message: 'El estado debe ser ACTIVO o INACTIVO' })
  estado_usuario: estado_usuario;

  @IsInt({ message: 'El ID de rol debe ser numerico' })
  @IsNotEmpty({ message: 'Debe indicar el rol del usuario' })
  id_rol_fk: number;
}
