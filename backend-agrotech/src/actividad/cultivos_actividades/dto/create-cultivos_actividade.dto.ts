import { IsInt, IsPositive } from 'class-validator';

export class CreateCultivosActividadesDto {
  @IsInt({ message: 'El id del cultivo debe ser un número entero' })
  @IsPositive({ message: 'El id del cultivo debe ser mayor que 0' })
  id_cultivo_fk: number;

  @IsInt({ message: 'El id de la actividad debe ser un número entero' })
  @IsPositive({ message: 'El id de la actividad debe ser mayor que 0' })
  id_actividad_fk: number;
  
}
