import { IsNotEmpty, IsString, IsInt, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermisoDto {
  @ApiProperty({
    description: 'Nombre del permiso dentro del sistema',
    example: 'Crear usuario', 
    maxLength: 30,
  })
  @IsNotEmpty()
  @IsString()
  nombre_permiso: string;

  @ApiProperty({
    description: 'Acción que representa el permiso (create, read, update, delete)',
    example: 'create', 
    enum: ['create', 'read', 'update', 'delete'],
  })
  @IsNotEmpty()
  @IsString()
  accion: string; 

  @ApiProperty({
    description: 'ID del módulo al que pertenece el permiso',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  moduleId: number;
  @ApiProperty({
    description: 'Indica si el permiso está activo o inactivo',
    example: true,
    required: false,
  })

  @IsOptional()
  activo?: boolean;
}
