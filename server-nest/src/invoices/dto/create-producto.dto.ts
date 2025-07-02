import { IsString, IsNumber, IsOptional, IsMongoId } from 'class-validator';

export class CreateProductoDto {
  // Campos en español (principales)
  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  precio: number;

  @IsString()
  @IsOptional()
  categoria?: string;

  @IsString()
  @IsOptional()
  impuestos?: string;

  @IsMongoId()
  empresaId: string;

  // Campos en inglés para compatibilidad (opcionales)
  @IsOptional()
  name?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  price?: number;

  @IsOptional()
  companyId?: string;
} 