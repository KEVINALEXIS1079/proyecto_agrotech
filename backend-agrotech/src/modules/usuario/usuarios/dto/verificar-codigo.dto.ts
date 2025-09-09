import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerificarCodigoDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@ejemplo.com',
  })
  @IsEmail({}, { message: 'El correo electrónico debe tener un formato válido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  email: string;

  @ApiProperty({
    description: 'Código de verificación de 6 dígitos',
    example: '123456',
  })
  @IsNotEmpty({ message: 'El código de verificación es obligatorio' })
  @Length(6, 6, { message: 'El código de verificación debe tener exactamente 6 dígitos' })
  codigo: string;
}
