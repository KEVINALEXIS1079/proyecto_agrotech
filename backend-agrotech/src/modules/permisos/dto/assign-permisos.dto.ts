// src/permisos/dto/assign-permisos.dto.ts
import { IsArray, ArrayNotEmpty, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignPermisosDto {
  @ApiProperty({
    description: 'Array de IDs de permisos a asignar',
    example: [1, 2, 3],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  permisoIds: number[];

  @ApiProperty({
    description: 'ID del usuario al que se le asignan los permisos',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  userId?: number;

  @ApiProperty({
    description: 'ID del rol al que se le asignan los permisos',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  roleId?: number;
}