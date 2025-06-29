import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Meal extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  calories: number;

  @Prop({ default: 0 })
  protein: number;

  @Prop({ default: 0 })
  carbs: number;

  @Prop({ default: 0 })
  fat: number;

  @Prop({ required: true })
  date: string; // YYYY-MM-DD format

  @Prop({ default: 'other' })
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'other';
}

export const MealSchema = SchemaFactory.createForClass(Meal);
