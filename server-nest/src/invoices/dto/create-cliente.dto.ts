import { IsString, IsEmail, IsOptional, IsMongoId } from 'class-validator';

export class CreateClienteDto {
  // Campos en español (principales)
  @IsString()
  nombre: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsString()
  @IsOptional()
  direccion?: string;

  @IsString()
  @IsOptional()
  taxId?: string;

  @IsMongoId()
  empresaId: string;

  // Campos en inglés para compatibilidad (opcionales)
  @IsOptional()
  name?: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  address?: string;

  @IsOptional()
  companyId?: string;
} 