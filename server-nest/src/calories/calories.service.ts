import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Meal } from './schemas/meal.schema';
import { CreateMealDto, CreateMealDtoType } from './dto/create-meal.dto';

@Injectable()
export class CaloriesService {
  constructor(@InjectModel(Meal.name) private mealModel: Model<Meal>) {}

  async create(data: CreateMealDtoType, userId: string) {
    const parsed = CreateMealDto.safeParse(data);
    if (!parsed.success) {
      throw new BadRequestException('Datos inválidos');
    }
    const meal = new this.mealModel({
      ...parsed.data,
      user: new Types.ObjectId(userId),
    });
    await meal.save();
    return meal;
  }

  async findAllByUser(userId: string) {
    return this.mealModel.find({ user: userId }).exec();
  }
}
