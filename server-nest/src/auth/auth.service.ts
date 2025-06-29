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

interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
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
    const user = new this.userModel({ email, password: hashed, name });
    await user.save();
    return { email: user.email, name: user.name, _id: user._id };
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
    const payload = { sub: user._id, email: user.email };
    const token = this.jwtService.sign(payload);
    return {
      token,
      user: { email: user.email, name: user.name, _id: user._id },
    };
  }

  refresh(user: JwtPayload) {
    if (!user) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    const payload = { sub: user.sub, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      success: true,
      data: {
        token,
        user: { email: user.email, _id: user.sub },
      },
    };
  }

  async getProfile(user: JwtPayload) {
    if (!user) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    const userDoc = (await this.userModel.findById(user.sub)) as User | null;
    if (!userDoc) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return {
      success: true,
      data: {
        id: userDoc._id,
        name: userDoc.name,
        email: userDoc.email,
        phone: userDoc.phone,
        plan: userDoc.plan || 'Free',
        role: userDoc.role || 'user',
        activeApps: userDoc.activeApps || ['habitkit'],
        isPremium: userDoc.plan !== 'Free',
        isInTrial: false,
        subscriptionExpired: false,
        settings: {},
        subscription: userDoc.subscription || null,
        points: userDoc.points || 0,
        level: userDoc.level || 1,
        planFeatures: this.getPlanFeatures(userDoc.plan || 'Free'),
        calorieProfile: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: new Date(),
      },
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
