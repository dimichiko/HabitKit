import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Habit extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ type: [String], default: [] })
  completedDates: string[]; // Fechas en formato YYYY-MM-DD
}

export const HabitSchema = SchemaFactory.createForClass(Habit);
