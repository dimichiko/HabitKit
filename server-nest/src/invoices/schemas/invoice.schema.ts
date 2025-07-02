import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InvoiceDocument = Invoice & Document;

@Schema({ timestamps: true })
export class Invoice {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Empresa', required: true })
  empresaId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Cliente', required: true })
  clienteId: Types.ObjectId;

  @Prop({ type: [Object], default: [] })
  items: Array<{
    nombre: string;
    cantidad: number;
    precio: number;
    subtotal?: number;
    impuestos?: string;
  }>;

  @Prop({ required: true, default: 0 })
  subtotal: number;

  @Prop({ required: true, default: 0 })
  total: number;

  @Prop({ default: 'factura' })
  tipo: 'factura' | 'presupuesto';

  @Prop({ default: 'pendiente' })
  status: 'pendiente' | 'pagada' | 'cancelada';

  @Prop()
  fechaEmision?: Date;

  @Prop()
  fechaVencimiento?: Date;

  @Prop()
  numero?: string;

  @Prop()
  notas?: string;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
