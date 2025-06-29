import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
    };
  }

  @Get('api/health')
  getApiHealth() {
    return {
      status: 'ok',
      service: 'habitkit-api',
      timestamp: new Date().toISOString(),
      endpoints: {
        auth: '/api/auth',
        habits: '/api/habits',
        invoices: '/api/invoices',
        calories: '/api/calories',
      },
    };
  }
}
