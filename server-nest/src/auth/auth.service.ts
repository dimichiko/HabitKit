import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { RegisterDto, RegisterDtoType } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, LoginDtoType } from './dto/login.dto';
import { EmailService } from '../email/email.service';
import * as crypto from 'crypto';

interface JwtPayload {
  sub: string;
  userId?: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async register(data: RegisterDtoType) {
    const parsed = RegisterDto.safeParse(data);
    if (!parsed.success) {
      throw new BadRequestException('Datos inválidos');
    }
    const { email, password, name } = parsed.data;
    const userExists = await this.userModel.findOne({ email });
    if (userExists) {
      throw new BadRequestException('El usuario ya existe');
    }
    const hashed = await bcrypt.hash(password, 10);
    
    // Generar token de verificación
    const verificationToken = crypto.randomBytes(32).toString('hex');
    console.log('🔑 Token generado para registro:', verificationToken);
    
    const user = new this.userModel({ 
      email, 
      password: hashed, 
      name,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
      isEmailVerified: false
    });
    await user.save();
    
    console.log('💾 Usuario guardado con token:', user.emailVerificationToken);

    // Enviar email de bienvenida
    const welcomeTemplate = this.emailService.getWelcomeEmailTemplate(name);
    await this.emailService.sendEmail({
      to: email,
      subject: welcomeTemplate.subject,
      html: welcomeTemplate.html,
      text: welcomeTemplate.text,
    });

    // Enviar email de verificación
    const verificationTemplate = this.emailService.getVerificationEmailTemplate(name, verificationToken);
    await this.emailService.sendEmail({
      to: email,
      subject: verificationTemplate.subject,
      html: verificationTemplate.html,
      text: verificationTemplate.text,
    });

    return { 
      email: user.email, 
      name: user.name, 
      _id: user._id,
      message: 'Usuario registrado. Revisa tu email para verificar tu cuenta.'
    };
  }

  async verifyEmail(token: string) {
    console.log('🔍 Verificando email con token:', token);
    
    // Buscar usuario con el token
    const user = await this.userModel.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    });

    console.log('👤 Usuario encontrado:', user ? 'Sí' : 'No');
    
    if (!user) {
      // Buscar si existe el token pero expiró
      const expiredUser = await this.userModel.findOne({ emailVerificationToken: token });
      if (expiredUser) {
        console.log('⏰ Token encontrado pero expirado');
        throw new BadRequestException('Token de verificación expirado');
      }
      
      console.log('❌ Token no encontrado');
      throw new BadRequestException('Token de verificación inválido');
    }

    console.log('✅ Token válido, verificando usuario:', user.email);
    
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    console.log('✅ Usuario verificado exitosamente');

    // Generar tokens de autenticación para login automático
    const payload = { sub: user._id, email: user.email };
    const authToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Cast explícito para acceder a timestamps usando unknown primero
    const typedUser = user as unknown as User & {
      createdAt: Date;
      updatedAt: Date;
    };

    return {
      message: 'Email verificado correctamente',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        plan: user.plan || 'free',
        isEmailVerified: user.isEmailVerified,
        twoFactorEnabled: user.twoFactorEnabled || false,
        createdAt: typedUser.createdAt,
        updatedAt: typedUser.updatedAt,
        activeApps: user.activeApps || ['habitkit'],
      },
      token: authToken,
      refreshToken,
    };
  }

  async resendVerification(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('El email ya está verificado');
    }

    // Generar nuevo token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    // Enviar nuevo email de verificación
    const verificationTemplate = this.emailService.getVerificationEmailTemplate(user.name, verificationToken);
    await this.emailService.sendEmail({
      to: email,
      subject: verificationTemplate.subject,
      html: verificationTemplate.html,
      text: verificationTemplate.text,
    });

    return { message: 'Email de verificación reenviado' };
  }

  async resetPassword(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      // Por seguridad, no revelamos si el email existe o no
      return { message: 'Si el email existe, recibirás un enlace para restablecer tu contraseña' };
    }

    // Generar token de reset
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
    await user.save();

    // Enviar email de reset
    const resetTemplate = this.emailService.getPasswordResetEmailTemplate(user.name, resetToken);
    await this.emailService.sendEmail({
      to: email,
      subject: resetTemplate.subject,
      html: resetTemplate.html,
      text: resetTemplate.text,
    });

    return { message: 'Si el email existe, recibirás un enlace para restablecer tu contraseña' };
  }

  async confirmPasswordReset(token: string, newPassword: string) {
    const user = await this.userModel.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new BadRequestException('Token de reset inválido o expirado');
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return { message: 'Contraseña actualizada correctamente' };
  }

  async login(data: LoginDtoType) {
    const parsed = LoginDto.safeParse(data);
    if (!parsed.success) {
      throw new BadRequestException('Datos inválidos');
    }
    const { email, password } = parsed.data;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('Usuario o contraseña incorrectos');
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new BadRequestException('Usuario o contraseña incorrectos');
    }

    // Verificar si el email está verificado
    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Verifica tu email');
    }

    const payload = { sub: user._id, email: user.email };
    const token = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Cast explícito para acceder a timestamps usando unknown primero
    const typedUser = user as unknown as User & {
      createdAt: Date;
      updatedAt: Date;
    };

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        plan: user.plan || 'free',
        isEmailVerified: user.isEmailVerified,
        twoFactorEnabled: user.twoFactorEnabled || false,
        createdAt: typedUser.createdAt,
        updatedAt: typedUser.updatedAt,
        activeApps: user.activeApps || ['habitkit'],
      },
      token,
      refreshToken,
    };
  }

  async enableTwoFactor(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    // Generar código 2FA
    const twoFactorCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.twoFactorCode = twoFactorCode;
    user.twoFactorCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos
    await user.save();

    // Enviar email con código
    const twoFactorTemplate = this.emailService.getTwoFactorEmailTemplate(user.name, twoFactorCode);
    await this.emailService.sendEmail({
      to: user.email,
      subject: twoFactorTemplate.subject,
      html: twoFactorTemplate.html,
      text: twoFactorTemplate.text,
    });

    return { message: 'Código de verificación enviado a tu email' };
  }

  async verifyTwoFactor(userId: string, code: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    if (user.twoFactorCode !== code || !user.twoFactorCodeExpires || user.twoFactorCodeExpires < new Date()) {
      throw new BadRequestException('Código inválido o expirado');
    }

    user.twoFactorEnabled = true;
    user.twoFactorCode = undefined;
    user.twoFactorCodeExpires = undefined;
    await user.save();

    return { message: 'Autenticación de dos factores habilitada' };
  }

  refresh(user: JwtPayload) {
    if (!user) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    const userId = user.userId || user.sub;
    const payload = { sub: userId, email: user.email };
    const token = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      token,
      refreshToken,
    };
  }

  async getProfile(user: JwtPayload) {
    console.log('AuthService - getProfile llamado con user:', user);
    console.log('AuthService - user.userId (userId):', user.userId || user.sub);

    if (!user) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    const userId = user.userId || user.sub;
    const userDoc = await this.userModel.findById(userId);
    console.log('AuthService - userDoc encontrado:', userDoc);

    if (!userDoc) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Cast explícito para acceder a timestamps usando unknown primero
    const typedUserDoc = userDoc as unknown as User & {
      createdAt: Date;
      updatedAt: Date;
    };

    return {
      id: userDoc._id,
      name: userDoc.name,
      email: userDoc.email,
      phone: userDoc.phone,
      plan: userDoc.plan || 'free',
      role: userDoc.role || 'user',
      activeApps: userDoc.activeApps || ['habitkit'],
      isEmailVerified: userDoc.isEmailVerified,
      twoFactorEnabled: userDoc.twoFactorEnabled || false,
      createdAt: typedUserDoc.createdAt,
      updatedAt: typedUserDoc.updatedAt,
      lastLogin: new Date(),
    };
  }

  private getPlanFeatures(plan: string): Record<string, any> {
    const features = {
      Free: {
        maxApps: 1,
        hasFullHistory: false,
        hasBackups: false,
        adsEnabled: true,
        supportLevel: 'limited',
      },
      Individual: {
        maxApps: 1,
        hasFullHistory: true,
        hasBackups: true,
        adsEnabled: false,
        supportLevel: 'email',
      },
      Flexible: {
        maxApps: 2,
        hasFullHistory: true,
        hasBackups: true,
        adsEnabled: false,
        supportLevel: 'email',
      },
      KitFull: {
        maxApps: 4,
        hasFullHistory: true,
        hasBackups: true,
        adsEnabled: false,
        supportLevel: 'priority',
      },
    };

    return (features[plan] || features.Free) as Record<string, any>;
  }
}
