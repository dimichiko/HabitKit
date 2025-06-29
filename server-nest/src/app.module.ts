import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HabitsModule } from './habits/habits.module';
import { InvoicesModule } from './invoices/invoices.module';
import { CaloriesModule } from './calories/calories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minuto
        limit: 100, // 100 requests por minuto
      },
    ]),
    DatabaseModule,
    AuthModule,
    UsersModule,
    HabitsModule,
    InvoicesModule,
    CaloriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
