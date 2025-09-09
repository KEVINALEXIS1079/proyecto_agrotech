import { Controller } from '@nestjs/common';
import { PermisosService } from './permisos.service';

@Controller('permisos')
export class PermisosController {
  constructor(private readonly permisosService: PermisosService) {}
}
