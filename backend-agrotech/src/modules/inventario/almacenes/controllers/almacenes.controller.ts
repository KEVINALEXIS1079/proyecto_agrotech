// src/modules/almacenes/controllers/almacenes.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  applyDecorators,
} from '@nestjs/common';
import { AlmacenesService } from '../services/almacenes.service';
import { CreateAlmacenDto } from '../dto/create-almacen.dto';
import { UpdateAlmacenDto } from '../dto/update-almacen.dto';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { AlmacenesDocs } from '../docs/almacenes.docs';

function ApiResponses(responses: { status: number; description: string }[]) {
  return applyDecorators(...responses.map((r) => ApiResponse(r)));
}

@ApiTags('Almacenes')
@ApiBearerAuth('access-token')
@Controller('almacenes')
@UseGuards(JwtAuthGuard, PermisosGuard)
export class AlmacenesController {
  constructor(private readonly almacenService: AlmacenesService) {}

  @Post()
  @PermisoRequerido('inventario:almacenes:create')
  @ApiOperation(AlmacenesDocs.create.operation)
  @ApiBody(AlmacenesDocs.create.body)
  @ApiResponses(AlmacenesDocs.create.response)
  create(@Body() dto: CreateAlmacenDto) {
    return this.almacenService.create(dto);
  }

  @Get()
  @PermisoRequerido('inventario:almacenes:read')
  @ApiOperation(AlmacenesDocs.findAll.operation)
  @ApiResponses(AlmacenesDocs.findAll.response)
  findAll() {
    return this.almacenService.findAll();
  }

  @Get(':id')
  @PermisoRequerido('inventario:almacenes:read')
  @ApiOperation(AlmacenesDocs.findOne.operation)
  @ApiResponses(AlmacenesDocs.findOne.response)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.almacenService.findOne(id);
  }

  @Patch(':id')
  @PermisoRequerido('inventario:almacenes:update')
  @ApiOperation(AlmacenesDocs.update.operation)
  @ApiBody(AlmacenesDocs.update.body)
  @ApiResponses(AlmacenesDocs.update.response)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAlmacenDto,
  ) {
    return this.almacenService.update(id, dto);
  }

  @Delete(':id')
  @PermisoRequerido('inventario:almacenes:delete')
  @ApiOperation(AlmacenesDocs.remove.operation)
  @ApiResponses(AlmacenesDocs.remove.response)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.almacenService.remove(id);
  }

  @Patch('restore/:id')
  @PermisoRequerido('inventario:almacenes:update')
  @ApiOperation(AlmacenesDocs.restore.operation)
  @ApiResponses(AlmacenesDocs.restore.response)
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.almacenService.restore(id);
  }
}
