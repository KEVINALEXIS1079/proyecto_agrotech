// src/permisos/dto/toggle-user-perm.dto.ts
import { IsBoolean, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ToggleUserPermDto {
  @ApiProperty({ example: 1 })
  @IsInt() @Min(1)
  userId: number;

  @ApiProperty({ example: 10 })
  @IsInt() @Min(1)
  permisoId: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  enable: boolean;
}
