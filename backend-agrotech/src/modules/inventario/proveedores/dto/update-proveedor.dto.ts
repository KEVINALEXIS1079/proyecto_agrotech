// src/proveedores/dto/update-proveedores.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateProveedorDto } from './create-proveedor.dto';

/*
Esta clase extiende de CreateProveedoresDto para permitir la actualización
de un proveedor. Utiliza PartialType para hacer que todos los campos sean opcionales.   
*/
export class UpdateProveedorDto extends PartialType(CreateProveedorDto) {}
