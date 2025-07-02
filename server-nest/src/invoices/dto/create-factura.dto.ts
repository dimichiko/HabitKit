import { IsString, IsNumber, IsArray, IsOptional, IsMongoId, IsDateString } from 'class-validator';

export class InvoiceItemDto {
  @IsString()
  nombre: string;

  @IsNumber()
  cantidad: number;

  @IsNumber()
  precio: number;

  @IsNumber()
  @IsOptional()
  subtotal?: number;

  @IsString()
  @IsOptional()
  impuestos?: string;
}

export class CreateFacturaDto {
  @IsMongoId()
  empresaId: string;

  @IsMongoId()
  clienteId: string;

  @IsArray()
  items: InvoiceItemDto[];

  @IsDateString()
  @IsOptional()
  fechaVencimiento?: string;

  @IsNumber()
  subtotal: number;

  @IsNumber()
  total: number;

  @IsString()
  @IsOptional()
  tipo?: string; // 'factura' o 'presupuesto'

  @IsString()
  @IsOptional()
  notas?: string;
} 