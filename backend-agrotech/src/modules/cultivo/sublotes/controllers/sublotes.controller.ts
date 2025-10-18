import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  applyDecorators,
} from '@nestjs/common';
import { SublotesService } from '../services/sublotes.service';
import { CreateSubloteDto } from '../dto/create-sublote.dto';
import { UpdateSubloteDto } from '../dto/update-sublote.dto';
import { PermisoRequerido } from 'src/common/decorator/permisos.decorator';
import { PermisosGuard } from 'src/common/guard/permisos.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SublotesGateway } from '../gateways/sublotes.gateway';
import { SublotesDocs } from '../docs/sublotes.docs';

// Helper para aplicar todos los ApiResponse de forma dinámica
function ApiResponses(responses: { status: number; description: string; schema?: any }[]) {
  return applyDecorators(...responses.map(r => ApiResponse(r)));
}

@ApiTags('Sublotes')
@ApiBearerAuth('access-token')
@Controller('sublotes')
export class SublotesController {
  constructor(
    private readonly sublotesService: SublotesService,
    private readonly sublotesGateway: SublotesGateway,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:sublotes:create')
  @ApiOperation(SublotesDocs.create.operation)
  @ApiBody(SublotesDocs.create.body)
  @ApiResponses(SublotesDocs.create.response)
  async create(@Body() createSubloteDto: CreateSubloteDto) {
    const sublote = await this.sublotesService.create(createSubloteDto);
    this.sublotesGateway.server.emit('sublotes:created', sublote);
    return sublote;
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:sublotes:read')
  @ApiOperation(SublotesDocs.findAll.operation)
  @ApiResponses(SublotesDocs.findAll.response)
  async findAll() {
    return await this.sublotesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:sublotes:read')
  @ApiOperation(SublotesDocs.findOne.operation)
  @ApiResponses(SublotesDocs.findOne.response)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.sublotesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:sublotes:update')
  @ApiOperation(SublotesDocs.update.operation)
  @ApiBody(SublotesDocs.update.body)
  @ApiResponses(SublotesDocs.update.response)
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateSubloteDto: UpdateSubloteDto) {
    const sublote = await this.sublotesService.update(id, updateSubloteDto);
    this.sublotesGateway.server.emit('sublotes:updated', sublote);
    return sublote;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:sublotes:delete')
  @ApiOperation(SublotesDocs.remove.operation)
  @ApiResponses(SublotesDocs.remove.response)
  async remove(@Param('id', ParseIntPipe) id: number) {
    const res = await this.sublotesService.remove(id);
    this.sublotesGateway.server.emit('sublotes:removed', { id });
    return res;
  }

  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @PermisoRequerido('cultivo:sublotes:update')
  @ApiOperation(SublotesDocs.restore.operation)
  @ApiResponses(SublotesDocs.restore.response)
  async restore(@Param('id', ParseIntPipe) id: number) {
    const sublote = await this.sublotesService.restore(id);
    this.sublotesGateway.server.emit('sublotes:restored', sublote);
    return sublote;
  }
}
