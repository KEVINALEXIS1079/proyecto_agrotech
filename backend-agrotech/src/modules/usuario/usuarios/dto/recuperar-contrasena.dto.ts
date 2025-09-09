import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecuperarContrasenaDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@ejemplo.com',
  })
  @IsEmail({}, { message: 'El correo electrónico debe tener un formato válido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  email: string;
}
