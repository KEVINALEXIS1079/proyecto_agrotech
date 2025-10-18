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
import { AlmacenesGateway } from '../gateways/almacenes.gateway';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AlmacenesDocs } from '../docs/almacenes.docs';

// Helper para ApiResponses
function ApiResponses(responses: { status: number; description: string }[]) {
  return applyDecorators(...responses.map(r => ApiResponse(r)));
}

@ApiTags('Almacenes')
@ApiBearerAuth('access-token')
@Controller('almacenes')
export class AlmacenesController {
  constructor(
    private readonly almacenService: AlmacenesService,
    private readonly almacenesGateway: AlmacenesGateway, // Gateway inyectado
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:almacenes:create')
  @ApiOperation(AlmacenesDocs.create.operation)
  @ApiBody(AlmacenesDocs.create.body)
  @ApiResponses(AlmacenesDocs.create.response)
  async create(@Body() dto: CreateAlmacenDto) {
    const result = await this.almacenService.create(dto);
    this.almacenesGateway.server.emit('almacenes:created', result); // Emitir evento
    return result;
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:almacenes:read')
  @ApiOperation(AlmacenesDocs.findAll.operation)
  @ApiResponses(AlmacenesDocs.findAll.response)
  async findAll() {
    return await this.almacenService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:almacenes:read')
  @ApiOperation(AlmacenesDocs.findOne.operation)
  @ApiResponses(AlmacenesDocs.findOne.response)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.almacenService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:almacenes:update')
  @ApiOperation(AlmacenesDocs.update.operation)
  @ApiBody(AlmacenesDocs.update.body)
  @ApiResponses(AlmacenesDocs.update.response)
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAlmacenDto) {
    const result = await this.almacenService.update(id, dto);
    this.almacenesGateway.server.emit('almacenes:updated', result); // Emitir evento
    return result;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:almacenes:delete')
  @ApiOperation(AlmacenesDocs.remove.operation)
  @ApiResponses(AlmacenesDocs.remove.response)
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.almacenService.remove(id);
    this.almacenesGateway.server.emit('almacenes:removed', { id }); // Emitir evento
    return result;
  }

  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('inventario:almacenes:update')
  @ApiOperation(AlmacenesDocs.restore.operation)
  @ApiResponses(AlmacenesDocs.restore.response)
  async restore(@Param('id', ParseIntPipe) id: number) {
    const result = await this.almacenService.restore(id);
    this.almacenesGateway.server.emit('almacenes:restored', result); // Emitir evento
    return result;
  }
}
