import { Module } from '@nestjs/common';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceSchema } from './schemas/invoice.schema';
import { Empresa, EmpresaSchema } from './schemas/empresa.schema';
import { Cliente, ClienteSchema } from './schemas/cliente.schema';
import { Producto, ProductoSchema } from './schemas/producto.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Invoice.name, schema: InvoiceSchema },
      { name: Empresa.name, schema: EmpresaSchema },
      { name: Cliente.name, schema: ClienteSchema },
      { name: Producto.name, schema: ProductoSchema },
    ]),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
  exports: [InvoicesService],
})
export class InvoicesModule {}
