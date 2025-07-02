import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDtoType } from './dto/create-invoice.dto';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { CreateProductoDto } from './dto/create-producto.dto';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: { userId: string; email: string };
}

@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  async create(
    @Body() body: CreateInvoiceDtoType,
    @Request() req: RequestWithUser,
  ) {
    return this.invoicesService.create(body, req.user.userId);
  }

  @Get()
  async findAll(@Request() req: RequestWithUser) {
    return this.invoicesService.findAllByUser(req.user.userId);
  }

  // Empresas
  @Get('empresas')
  async findAllEmpresas(@Request() req: RequestWithUser) {
    return this.invoicesService.findAllEmpresasByUser(req.user.userId);
  }

  @Post('empresas')
  async createEmpresa(
    @Body() body: CreateEmpresaDto,
    @Request() req: RequestWithUser,
  ) {
    console.log('📝 Datos recibidos en createEmpresa:', body);
    return this.invoicesService.createEmpresa(body, req.user.userId);
  }

  @Put('empresas/:id')
  async updateEmpresa(
    @Param('id') id: string,
    @Body() body: CreateEmpresaDto,
    @Request() req: RequestWithUser,
  ) {
    return this.invoicesService.updateEmpresa(id, body, req.user.userId);
  }

  @Delete('empresas/:id')
  async deleteEmpresa(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ) {
    return this.invoicesService.deleteEmpresa(id, req.user.userId);
  }

  // Clientes
  @Get('clientes')
  async findAllClientes(
    @Query('empresaId') empresaId: string,
    @Request() req: RequestWithUser,
  ) {
    return this.invoicesService.findAllClientesByEmpresa(
      empresaId,
      req.user.userId,
    );
  }

  @Post('clientes')
  async createCliente(
    @Body() body: CreateClienteDto,
    @Request() req: RequestWithUser,
  ) {
    return this.invoicesService.createCliente(body, req.user.userId);
  }

  @Put('clientes/:id')
  async updateCliente(
    @Param('id') id: string,
    @Body() body: CreateClienteDto,
    @Request() req: RequestWithUser,
  ) {
    console.log('🔄 PUT /clientes/:id - Datos recibidos:', {
      id,
      body,
      userId: req.user.userId,
    });
    return this.invoicesService.updateCliente(id, body, req.user.userId);
  }

  @Delete('clientes/:id')
  async deleteCliente(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ) {
    console.log('🗑️ DELETE /clientes/:id - Datos recibidos:', {
      id,
      userId: req.user.userId,
    });
    return this.invoicesService.deleteCliente(id, req.user.userId);
  }

  // Productos
  @Get('productos')
  async findAllProductos(
    @Query('empresaId') empresaId: string,
    @Request() req: RequestWithUser,
  ) {
    return this.invoicesService.findAllProductosByEmpresa(
      empresaId,
      req.user.userId,
    );
  }

  @Post('productos')
  async createProducto(
    @Body() body: CreateProductoDto,
    @Request() req: RequestWithUser,
  ) {
    return this.invoicesService.createProducto(body, req.user.userId);
  }

  @Put('productos/:id')
  async updateProducto(
    @Param('id') id: string,
    @Body() body: CreateProductoDto,
    @Request() req: RequestWithUser,
  ) {
    return this.invoicesService.updateProducto(id, body, req.user.userId);
  }

  @Delete('productos/:id')
  async deleteProducto(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ) {
    return this.invoicesService.deleteProducto(id, req.user.userId);
  }

  // Facturas
  @Post('facturas')
  async createFactura(
    @Body() body: CreateFacturaDto,
    @Request() req: RequestWithUser,
  ) {
    console.log('🧾 POST /facturas - Datos recibidos:', {
      body,
      userId: req.user.userId,
    });
    return this.invoicesService.createFactura(body, req.user.userId);
  }

  @Get('facturas')
  async findAllFacturas(
    @Query('empresaId') empresaId: string,
    @Request() req: RequestWithUser,
  ) {
    console.log('📋 GET /facturas - Datos recibidos:', {
      empresaId,
      userId: req.user.userId,
    });
    return this.invoicesService.findAllFacturasByEmpresa(
      empresaId,
      req.user.userId,
    );
  }

  @Put('facturas/:id')
  async updateFactura(
    @Param('id') id: string,
    @Body() body: CreateFacturaDto,
    @Request() req: RequestWithUser,
  ) {
    console.log('🔄 PUT /facturas/:id - Datos recibidos:', {
      id,
      body,
      userId: req.user.userId,
    });
    return this.invoicesService.updateFactura(id, body, req.user.userId);
  }

  @Delete('facturas/:id')
  async deleteFactura(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ) {
    console.log('🗑️ DELETE /facturas/:id - Datos recibidos:', {
      id,
      userId: req.user.userId,
    });
    return this.invoicesService.deleteFactura(id, req.user.userId);
  }

  @Patch('facturas/:id/toggle-payment')
  async toggleFacturaPayment(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ) {
    return this.invoicesService.toggleFacturaPayment(id, req.user.userId);
  }
}
