import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDtoType } from './dto/register.dto';
import { LoginDtoType } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

interface RequestWithUser extends Request {
  user: {
    sub: string;
    email: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() data: RegisterDtoType) {
    return this.authService.register(data);
  }

  @Post('login')
  async login(@Body() data: LoginDtoType) {
    return this.authService.login(data);
  }

  @Post('refresh')
  async refresh(@Body() data: { refreshToken: string }) {
    // Aquí deberías validar el refresh token y generar nuevos tokens
    return { message: 'Refresh token endpoint' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: RequestWithUser) {
    return this.authService.getProfile(req.user);
  }

  @Post('verify-email')
  async verifyEmail(@Body() data: { token: string }) {
    return this.authService.verifyEmail(data.token);
  }

  @Post('resend-verification')
  async resendVerification(@Body() data: { email: string }) {
    return this.authService.resendVerification(data.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() data: { email: string }) {
    return this.authService.resetPassword(data.email);
  }

  @Post('confirm-password-reset')
  async confirmPasswordReset(@Body() data: { token: string; newPassword: string }) {
    return this.authService.confirmPasswordReset(data.token, data.newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Post('enable-2fa')
  async enableTwoFactor(@Request() req: RequestWithUser) {
    return this.authService.enableTwoFactor(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-2fa')
  async verifyTwoFactor(@Request() req: RequestWithUser, @Body() data: { code: string }) {
    return this.authService.verifyTwoFactor(req.user.sub, data.code);
  }
}
