// src/proveedores/dto/update-proveedores.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateProveedoresDto } from './create-proveedores.dto';

/*
Esta clase extiende de CreateProveedoresDto para permitir la actualización
de un proveedor. Utiliza PartialType para hacer que todos los campos sean opcionales.   
*/
export class UpdateProveedoresDto extends PartialType(CreateProveedoresDto) {}
