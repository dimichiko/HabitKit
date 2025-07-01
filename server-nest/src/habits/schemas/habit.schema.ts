import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Habit extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ default: '#4ade80' })
  color: string;

  @Prop({ default: 1, min: 1 })
  timesPerDay: number;

  @Prop({ default: '' })
  folder: string;

  @Prop({ type: [String], default: [] })
  completedDates: string[]; // Fechas en formato YYYY-MM-DD
}

export const HabitSchema = SchemaFactory.createForClass(Habit);
