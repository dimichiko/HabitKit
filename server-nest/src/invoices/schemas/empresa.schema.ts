import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EmpresaDocument = Empresa & Document;

@Schema({ timestamps: true })
export class Empresa {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  phone?: string;

  @Prop()
  address?: string;

  @Prop()
  taxId?: string;

  @Prop()
  ruc?: string;

  @Prop()
  notes?: string;

  @Prop()
  businessType?: string;

  @Prop({ default: 'EUR' })
  currency?: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;
}

export const EmpresaSchema = SchemaFactory.createForClass(Empresa); 