// src/permisos/dto/get-permisos-by-rol.dto.ts
import { IsInt, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetPermisosByRolDto {
  @ApiProperty({ example: 1 })
  @IsInt() @Min(1)
  id_rol_pk: number;

  @ApiProperty({ example: 2, required: false, description: 'Filtrar por módulo' })
  @IsOptional()
  @IsInt() @Min(1)
  moduleId?: number;
}
