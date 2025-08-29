import { IsNotEmpty, IsDate, IsString, MaxLength, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEvidenciaDto {
    @IsString({ message: 'El nombre de la evidencia debe ser texto' })
    @IsNotEmpty({ message: 'El nombre de la evidencia no puede estar vacío' })
    @MaxLength(255, { message: 'El nombre de la evidencia no puede exceder los 255 caracteres' })
    nombre_evidencia: string;

    @IsString({ message: 'La descripción de la evidencia debe ser texto' })
    @IsNotEmpty({ message: 'La descripción de la evidencia no puede estar vacía' })
    @MaxLength(500, { message: 'La descripción de la evidencia no puede exceder los 500 caracteres' })
    descripcion_evidencia: string;

    @Type(() => Date)
    @IsDate({ message: 'La fecha de la evidencia debe ser una fecha válida con formato Año/Mes/dia' })
    @IsNotEmpty({ message: 'La fecha de la evidencia no puede estar vacía' })
    fecha_evidencia: Date;

    @IsString({ message: 'La observación de la evidencia debe ser texto' })
    @IsNotEmpty({ message: 'La observación de la evidencia no puede estar vacía' })
    @MaxLength(500, { message: 'La observación de la evidencia no puede exceder los 500 caracteres' })
    observacion_evidencia: string;

    @Type(() => Date)
    @IsDate({ message: 'La fecha de inicio de la evidencia debe ser una fecha válida con formato Año/Mes/dia' })
    @IsNotEmpty({ message: 'La fecha de inicio de la evidencia no puede estar vacía' })
    fecha_inicio_evidencia: Date;

    @Type(() => Date)
    @IsDate({ message: 'La fecha de fin de la evidencia debe ser una fecha válida con formato Año/Mes/dia' })
    @IsNotEmpty({ message: 'La fecha de fin de la evidencia no puede estar vacía' })
    fecha_fin_evidencia: Date;

    @Type(() => Number)
    @IsInt({ message: 'El ID del cultivo debe ser un número entero' })
    @IsNotEmpty({ message: 'El ID del cultivo no puede estar vacío' })
    id_cultivo_fk: number;
}
