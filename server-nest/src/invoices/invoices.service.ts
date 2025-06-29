import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Invoice } from './schemas/invoice.schema';
import {
  CreateInvoiceDto,
  CreateInvoiceDtoType,
} from './dto/create-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
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
}
