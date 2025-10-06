import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermisoModuleDto {
  @ApiProperty({
    description: 'Nombre del módulo dentro del sistema',
    example: 'Usuarios', 
    maxLength: 30,
  })
  @IsNotEmpty()
  @IsString()
  nombre: string;
}
