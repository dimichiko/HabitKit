import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Invoice } from './schemas/invoice.schema';
import { Empresa } from './schemas/empresa.schema';
import { Cliente } from './schemas/cliente.schema';
import { Producto } from './schemas/producto.schema';
import {
  CreateInvoiceDto,
  CreateInvoiceDtoType,
} from './dto/create-invoice.dto';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { CreateProductoDto } from './dto/create-producto.dto';
import { CreateFacturaDto } from './dto/create-factura.dto';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
    @InjectModel(Empresa.name) private empresaModel: Model<Empresa>,
    @InjectModel(Cliente.name) private clienteModel: Model<Cliente>,
    @InjectModel(Producto.name) private productoModel: Model<Producto>,
  ) {}

  async create(data: CreateInvoiceDtoType, userId: string) {
    const parsed = CreateInvoiceDto.safeParse(data);
    if (!parsed.success) {
      throw new BadRequestException('Datos inválidos');
    }
    const invoice = new this.invoiceModel({
      ...parsed.data,
      user: new Types.ObjectId(userId),
      invoiceNumber: `INV-${Date.now()}`,
    });
    await invoice.save();
    return invoice;
  }

  async findAllByUser(userId: string) {
    return this.invoiceModel.find({ user: userId }).exec();
  }

  // Empresas
  async createEmpresa(data: CreateEmpresaDto, userId: string) {
    const empresa = new this.empresaModel({
      ...data,
      userId: new Types.ObjectId(userId),
    });
    await empresa.save();
    return empresa;
  }

  async findAllEmpresasByUser(userId: string) {
    return this.empresaModel
      .find({ userId: new Types.ObjectId(userId) })
      .exec();
  }

  async updateEmpresa(id: string, data: CreateEmpresaDto, userId: string) {
    const empresa = await this.empresaModel.findOneAndUpdate(
      {
        _id: id,
        userId: new Types.ObjectId(userId),
      },
      data,
      { new: true },
    );
    if (!empresa) {
      throw new BadRequestException('Empresa no encontrada');
    }
    return empresa;
  }

  async deleteEmpresa(id: string, userId: string) {
    const empresa = await this.empresaModel.findOneAndDelete({
      _id: id,
      userId: new Types.ObjectId(userId),
    });
    if (!empresa) {
      throw new BadRequestException('Empresa no encontrada');
    }
    return { message: 'Empresa eliminada correctamente' };
  }

  // Clientes
  async createCliente(data: CreateClienteDto, userId: string) {
    // Normalizar campos para manejar tanto inglés como español
    const normalizedData = {
      name: data.nombre || data.name,
      email: data.email,
      phone: data.telefono || data.phone,
      address: data.direccion || data.address,
      taxId: data.taxId,
      empresaId: data.empresaId || data.companyId,
    };

    const cliente = new this.clienteModel({
      ...normalizedData,
      empresaId: new Types.ObjectId(normalizedData.empresaId),
      userId: new Types.ObjectId(userId),
    });
    await cliente.save();
    return cliente;
  }

  async findAllClientesByEmpresa(empresaId: string, userId: string) {
    return this.clienteModel
      .find({
        empresaId: new Types.ObjectId(empresaId),
        userId: new Types.ObjectId(userId),
      })
      .exec();
  }

  async updateCliente(id: string, data: CreateClienteDto, userId: string) {
    console.log('🔍 Buscando cliente para actualizar:', { id, userId, empresaId: data.empresaId });
    
    // Validar que el ID sea válido
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID de cliente inválido');
    }
    
    // Normalizar campos para manejar tanto inglés como español
    const normalizedData = {
      name: data.nombre || data.name,
      email: data.email,
      phone: data.telefono || data.phone,
      address: data.direccion || data.address,
      taxId: data.taxId,
      empresaId: data.empresaId || data.companyId,
    };

    const cliente = await this.clienteModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId),
        empresaId: new Types.ObjectId(normalizedData.empresaId),
      },
      {
        ...normalizedData,
        empresaId: new Types.ObjectId(normalizedData.empresaId),
      },
      { new: true },
    );
    
    if (!cliente) {
      console.log('❌ Cliente no encontrado para actualizar');
      throw new BadRequestException('Cliente no encontrado');
    }
    
    console.log('✅ Cliente actualizado correctamente:', cliente._id);
    return cliente;
  }

  async deleteCliente(id: string, userId: string) {
    console.log('🗑️ Intentando eliminar cliente:', { id, userId });
    
    // Validar que el ID sea válido
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID de cliente inválido');
    }
    
    const cliente = await this.clienteModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId),
    });
    
    if (!cliente) {
      console.log('❌ Cliente no encontrado para eliminar');
      throw new BadRequestException('Cliente no encontrado');
    }
    
    console.log('✅ Cliente eliminado correctamente:', cliente._id);
    return { message: 'Cliente eliminado correctamente' };
  }

  // Productos
  async createProducto(data: CreateProductoDto, userId: string) {
    // Normalizar campos para manejar tanto inglés como español
    const normalizedData = {
      name: data.nombre || data.name,
      description: data.descripcion || data.description,
      price: data.precio || data.price,
      categoria: data.categoria,
      impuestos: data.impuestos,
      empresaId: data.empresaId || data.companyId,
    };

    const producto = new this.productoModel({
      ...normalizedData,
      empresaId: new Types.ObjectId(normalizedData.empresaId),
      userId: new Types.ObjectId(userId),
    });
    await producto.save();
    return producto;
  }

  async findAllProductosByEmpresa(empresaId: string, userId: string) {
    return this.productoModel
      .find({
        empresaId: new Types.ObjectId(empresaId),
        userId: new Types.ObjectId(userId),
      })
      .exec();
  }

  async updateProducto(id: string, data: CreateProductoDto, userId: string) {
    // Normalizar campos para manejar tanto inglés como español
    const normalizedData = {
      name: data.nombre || data.name,
      description: data.descripcion || data.description,
      price: data.precio || data.price,
      categoria: data.categoria,
      impuestos: data.impuestos,
      empresaId: data.empresaId || data.companyId,
    };

    const producto = await this.productoModel.findOneAndUpdate(
      {
        _id: id,
        userId: new Types.ObjectId(userId),
      },
      {
        ...normalizedData,
        empresaId: new Types.ObjectId(normalizedData.empresaId),
      },
      { new: true },
    );
    if (!producto) {
      throw new BadRequestException('Producto no encontrado');
    }
    return producto;
  }

  async deleteProducto(id: string, userId: string) {
    const producto = await this.productoModel.findOneAndDelete({
      _id: id,
      userId: new Types.ObjectId(userId),
    });
    if (!producto) {
      throw new BadRequestException('Producto no encontrado');
    }
    return { message: 'Producto eliminado correctamente' };
  }

  // Facturas
  async createFactura(data: CreateFacturaDto, userId: string) {
    const factura = new this.invoiceModel({
      ...data,
      empresaId: new Types.ObjectId(data.empresaId),
      clienteId: new Types.ObjectId(data.clienteId),
      userId: new Types.ObjectId(userId),
      fechaEmision: new Date(),
      numero: `FAC-${Date.now()}`,
    });
    await factura.save();
    return factura;
  }

  async findAllFacturasByEmpresa(empresaId: string, userId: string) {
    return this.invoiceModel
      .find({
        empresaId: new Types.ObjectId(empresaId),
        userId: new Types.ObjectId(userId),
      })
      .populate('clienteId', 'name email')
      .exec();
  }

  async updateFactura(id: string, data: CreateFacturaDto, userId: string) {
    const factura = await this.invoiceModel.findOneAndUpdate(
      {
        _id: id,
        userId: new Types.ObjectId(userId),
      },
      {
        ...data,
        empresaId: new Types.ObjectId(data.empresaId),
        clienteId: new Types.ObjectId(data.clienteId),
      },
      { new: true },
    );
    if (!factura) {
      throw new BadRequestException('Factura no encontrada');
    }
    return factura;
  }

  async deleteFactura(id: string, userId: string) {
    const factura = await this.invoiceModel.findOneAndDelete({
      _id: id,
      userId: new Types.ObjectId(userId),
    });
    if (!factura) {
      throw new BadRequestException('Factura no encontrada');
    }
    return { message: 'Factura eliminada correctamente' };
  }

  async toggleFacturaPayment(id: string, userId: string) {
    const factura = await this.invoiceModel.findOne({
      _id: id,
      userId: new Types.ObjectId(userId),
    });
    if (!factura) {
      throw new BadRequestException('Factura no encontrada');
    }
    factura.status = factura.status === 'pagada' ? 'pendiente' : 'pagada';
    await factura.save();
    return factura;
  }
}
