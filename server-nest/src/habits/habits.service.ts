import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Habit } from './schemas/habit.schema';
import { CreateHabitDto, CreateHabitDtoType } from './dto/create-habit.dto';

@Injectable()
export class HabitsService {
  constructor(@InjectModel(Habit.name) private habitModel: Model<Habit>) {}

  async create(data: CreateHabitDtoType, userId: string) {
    const parsed = CreateHabitDto.safeParse(data);
    if (!parsed.success) {
      throw new BadRequestException('Datos inválidos');
    }
    const habit = new this.habitModel({
      ...parsed.data,
      user: new Types.ObjectId(userId),
    });
    await habit.save();
    return habit;
  }

  async findAllByUser(userId: string) {
    return this.habitModel.find({ user: userId }).exec();
  }
}
