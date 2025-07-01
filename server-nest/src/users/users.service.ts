import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { EmailService } from '../email/email.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly emailService: EmailService,
  ) {}

  async findAll() {
    return this.userModel.find().exec();
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  async update(id: string, updateUserDto: Partial<User>) {
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  async remove(id: string) {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return { message: 'Usuario eliminado correctamente' };
  }

  async updatePlan(userId: string, newPlan: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const oldPlan = user.plan;
    user.plan = newPlan;
    await user.save();

    // Enviar email de confirmación de actualización de plan
    const planUpdateTemplate = this.emailService.getPlanUpdateEmailTemplate(user.name, newPlan);
    await this.emailService.sendEmail({
      to: user.email,
      subject: planUpdateTemplate.subject,
      html: planUpdateTemplate.html,
      text: planUpdateTemplate.text,
    });

    return {
      message: 'Plan actualizado correctamente',
      oldPlan,
      newPlan,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        activeApps: user.activeApps,
      }
    };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar contraseña actual
    const bcrypt = require('bcryptjs');
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      throw new BadRequestException('Contraseña actual incorrecta');
    }

    // Hashear nueva contraseña
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    return { message: 'Contraseña actualizada correctamente' };
  }

  async updateProfile(userId: string, profileData: Partial<User>) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Solo permitir actualizar ciertos campos
    const allowedFields = ['name', 'phone'];
    const updateData: Partial<User> = {};
    
    for (const field of allowedFields) {
      if (profileData[field] !== undefined) {
        updateData[field] = profileData[field];
      }
    }

    Object.assign(user, updateData);
    await user.save();

    return {
      message: 'Perfil actualizado correctamente',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        plan: user.plan,
        activeApps: user.activeApps,
      }
    };
  }
}
