// src/permisos/dto/get-permisos-by-user.dto.ts
import { IsInt, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetPermisosByUserDto {
  @ApiProperty({ example: 1 })
  @IsInt() @Min(1)
  id_usuario_pk: number;

  @ApiProperty({ example: 2, required: false, description: 'Filtrar por módulo' })
  @IsOptional()
  @IsInt() @Min(1)
  moduleId?: number;
}
