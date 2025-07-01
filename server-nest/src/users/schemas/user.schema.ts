import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  phone?: string;

  @Prop({ default: 'user' })
  role: string;

  @Prop({ default: 0 })
  points: number;

  @Prop({ default: 1 })
  level: number;

  @Prop({ default: 'Free' })
  plan: string;

  @Prop({
    type: Object,
    default: {},
  })
  subscription: Record<string, any>;

  @Prop({
    type: [String],
    default: [],
  })
  activeApps: string[];

  @Prop({ default: false })
  hasFullHistory: boolean;

  @Prop({ default: false })
  hasBackups: boolean;

  @Prop({ default: true })
  adsEnabled: boolean;

  @Prop({ default: 'limited' })
  supportLevel: string;

  // Campos para verificación de email
  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop()
  emailVerificationToken?: string;

  @Prop()
  emailVerificationExpires?: Date;

  // Campos para reset de contraseña
  @Prop()
  passwordResetToken?: string;

  @Prop()
  passwordResetExpires?: Date;

  // Campos para 2FA
  @Prop({ default: false })
  twoFactorEnabled: boolean;

  @Prop()
  twoFactorCode?: string;

  @Prop()
  twoFactorCodeExpires?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
