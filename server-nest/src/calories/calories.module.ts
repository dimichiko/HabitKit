import { Module } from '@nestjs/common';
import { CaloriesController } from './calories.controller';
import { CaloriesService } from './calories.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Meal, MealSchema } from './schemas/meal.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Meal.name, schema: MealSchema }]),
  ],
  controllers: [CaloriesController],
  providers: [CaloriesService],
  exports: [CaloriesService],
})
export class CaloriesModule {}
