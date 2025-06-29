import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/habitkit',
      {
        serverSelectionTimeoutMS: 5000, // Timeout de 5 segundos
        socketTimeoutMS: 45000,
        bufferCommands: false,
      },
    ),
  ],
})
export class DatabaseModule {}
