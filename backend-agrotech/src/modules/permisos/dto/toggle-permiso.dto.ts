import { IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TogglePermisoDto {

  @ApiProperty({
    description: 'Indica si el permiso está activo o inactivo',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  activo: boolean;

  @ApiProperty({
    description: 'ID del usuario al que se le asigna o remueve el permiso',
    example: 1,
  })
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: 'ID del permiso a activar o desactivar',
    example: 1,
  })
  @IsNotEmpty()
  permisoId: number;
  
}
