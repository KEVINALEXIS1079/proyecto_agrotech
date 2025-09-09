import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,Length,
} from 'class-validator';
import { estado_usuario } from '../entities/usuario.entity';
import { ApiProperty } from '@nestjs/swagger';

export class RegistrarUsuarioPublicDTO{
    @ApiProperty({
        description: 'Cedula del usuario(mumero entre 6y 15 digitos',
        example: ['123456','98745632101']
    })
    @IsString({ message: ' La cedula debe ser una cadena numerica'})
    @Matches(/^[0-9]+$/, { message: 'La cedula solo debe contener numeros' })
    @Length(6, 15, { message: 'La cedula debe tener entre 6 y 15 dígitos' })
    cedula_usuario: string;

    @ApiProperty({
        description: 'Nombre del usuario',
        example:['Oscar','Maria']
    })
    @IsString({ message: 'El nombre del usuario debe ser texto' })
    @MaxLength(30, { message: 'El nombre no debe superar los 30 caracteres' })
    @IsNotEmpty({ message: 'El nombre no puede estar vacio' })
    nombre_usuario: string;

    @ApiProperty({
        description: 'Apellido del usuario',
        example: ['Ortega','Rojas']
    })
    @IsString({ message: 'El apellido del usuario debe ser texto' })
    @MaxLength(30, { message: 'El apellido no debe superar los 30 caracteres' })
    @IsNotEmpty({ message: 'El apellido no puede estar vacio' })
    apellido_usuario: string;

    @ApiProperty({
        description:'El telefono del usuario debe ser texto',
        example: ['3105821475','3205874152']
    })
    @IsString({ message: 'El telefono debe ser una cadena numerica' })
    @Length(10, 10, { message: 'El numero debe tener exactamente 10 digitos' })
    @Matches(/^[0-9]+$/, { message: 'El teléfono solo debe contener numeros' })
    telefono_usuario: string;

    @ApiProperty({
        description: 'El corro electronico del usuario debe superar los 100 caracteres',
        example: ['usuario@gmail.com', 'test@example.org']
    })
    @IsEmail({}, { message: 'Debe ser un correo electrónico valido' })
    @MaxLength(100, { message: 'El correo no debe superar los 100 caracteres' })
    correo_usuario: string;

    @ApiProperty({
        description: 'Contraseña del usuaario (minimo 6 caracteres)',
        example: ['clave123', 'P@ssw0rd!']
    })
    @IsString({ message: 'La contraseña debe ser texto' })
    @Length(6, 50, { message: 'La contraseña debe tener entre 6 y 50 caracteres' })
    contrasena_usuario: string;

  // Por defecto todos los registros públicos se crean como ACTIVO
    @ApiProperty({
        description: 'El estado debe ser activo o inactivo, para hacer un registro como invitado sera por defecto (activo)',
        example: ['activo','inactivo']
    })
    @IsEnum(estado_usuario, { message: 'El estado debe ser activo o inactivo' })
    estado_usuario: estado_usuario = estado_usuario.ACTIVO;


}