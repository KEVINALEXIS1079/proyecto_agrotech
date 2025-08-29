import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  correo_usuario: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  contrasena_usuario: string;
}
