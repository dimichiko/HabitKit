import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Invoice extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  clientName: string;

  @Prop()
  clientEmail?: string;

  @Prop({ type: [Object], default: [] })
  items: Array<{
    description: string;
    quantity: number;
    price: number;
  }>;

  @Prop({ required: true, default: 0 })
  total: number;

  @Prop({ default: 'pending' })
  status: 'pending' | 'paid' | 'cancelled';

  @Prop()
  invoiceNumber?: string;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
