import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRolDto {
  @ApiProperty({
    description: 'Nombre del rol dentro del sistema',
    example: 'Instructor', // 
    maxLength: 15,
  })
  @IsString({ message: 'El rol debe de ser una cadena de texto' })
  @MaxLength(15, { message: 'No debe de superar los 15 caracteres' })
  nombre_rol: string;
}
