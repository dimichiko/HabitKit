import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDtoType } from './dto/create-invoice.dto';
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
}
