import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Habit } from './schemas/habit.schema';
import { Folder } from './schemas/folder.schema';
import { CreateHabitDto, CreateHabitDtoType } from './dto/create-habit.dto';

@Injectable()
export class HabitsService {
  constructor(
    @InjectModel(Habit.name) private habitModel: Model<Habit>,
    @InjectModel(Folder.name) private folderModel: Model<Folder>,
  ) {}

  async create(data: CreateHabitDtoType, userId: string) {
    console.log('HabitsService - create llamado con:', { data, userId });
    const parsed = CreateHabitDto.safeParse(data);
    if (!parsed.success) {
      console.log('HabitsService - validación falló:', parsed.error);
      throw new BadRequestException('Datos inválidos');
    }
    console.log('HabitsService - datos validados:', parsed.data);
    const habit = new this.habitModel({
      ...parsed.data,
      user: new Types.ObjectId(userId),
    });
    await habit.save();
    console.log('HabitsService - hábito guardado:', habit);
    return habit;
  }

  async findAllByUser(userId: string) {
    return this.habitModel.find({ user: userId }).exec();
  }

  async update(id: string, data: Partial<CreateHabitDtoType>, userId: string) {
    const habit = await this.habitModel.findOneAndUpdate(
      {
        _id: id,
        user: userId,
      },
      { $set: data },
      { new: true },
    );
    if (!habit) {
      throw new NotFoundException('Hábito no encontrado');
    }
    return habit;
  }

  async remove(id: string, userId: string) {
    const habit = await this.habitModel.findOneAndDelete({
      _id: id,
      user: userId,
    });
    if (!habit) {
      throw new NotFoundException('Hábito no encontrado');
    }
    return { message: 'Hábito eliminado' };
  }

  async addCheckin(id: string, userId: string) {
    const today = new Date().toISOString().slice(0, 10);
    const habit = await this.habitModel.findOne({ _id: id, user: userId });
    if (!habit) {
      throw new NotFoundException('Hábito no encontrado');
    }

    if (!habit.completedDates.includes(today)) {
      habit.completedDates.push(today);
      await habit.save();
    }

    return habit;
  }

  async getCheckins(id: string, userId: string) {
    const habit = await this.habitModel.findOne({ _id: id, user: userId });
    if (!habit) {
      throw new NotFoundException('Hábito no encontrado');
    }
    return habit.completedDates.map((date) => ({ date, habitId: id }));
  }

  async getStats(id: string, userId: string) {
    const habit = await this.habitModel.findOne({ _id: id, user: userId });
    if (!habit) {
      throw new NotFoundException('Hábito no encontrado');
    }

    const today = new Date().toISOString().slice(0, 10);
    const completedToday = habit.completedDates.includes(today);

    // Calcular streak actual
    let currentStreak = 0;
    const sortedDates = habit.completedDates.sort().reverse();
    let currentDate = new Date();

    for (const dateStr of sortedDates) {
      const date = new Date(dateStr);
      const diffTime = Math.abs(currentDate.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 1) {
        currentStreak++;
        currentDate = date;
      } else {
        break;
      }
    }

    return {
      currentStreak,
      completedToday,
      totalCompletions: habit.completedDates.length,
    };
  }

  async getFolders(userId: string) {
    console.log('HabitsService - getFolders llamado con userId:', userId);
    const folders = await this.folderModel.find({ user: userId }).exec();
    console.log('HabitsService - carpetas encontradas:', folders);
    return folders;
  }

  async createFolder(name: string, userId: string) {
    console.log('HabitsService - createFolder llamado con:', {
      name,
      userId,
    });
    
    // Validar que no exista una carpeta con ese nombre para este usuario
    const existingFolder = await this.folderModel.findOne({
      name: name.trim(),
      user: userId,
    });
    
    if (existingFolder) {
      console.log('HabitsService - carpeta ya existe:', existingFolder);
      throw new BadRequestException('Ya existe una carpeta con ese nombre');
    }
    
    // Crear nueva carpeta
    const folder = new this.folderModel({
      name: name.trim(),
      user: new Types.ObjectId(userId),
      color: '#6B7280',
    });
    
    await folder.save();
    console.log('HabitsService - carpeta guardada:', folder);
    return folder;
  }

  async deleteFolder(folderId: string, userId: string) {
    console.log('HabitsService - deleteFolder llamado con:', { folderId, userId });
    
    const folder = await this.folderModel.findOneAndDelete({
      _id: folderId,
      user: userId,
    });
    
    if (!folder) {
      throw new NotFoundException('Carpeta no encontrada');
    }
    
    console.log('HabitsService - carpeta eliminada:', folder);
    return { message: 'Carpeta eliminada' };
  }

  async getCheckinCounts(habitIds: string[], userId: string) {
    const today = new Date().toISOString().slice(0, 10);
    const habits = await this.habitModel.find({
      _id: { $in: habitIds },
      user: userId,
    });

    const counts: Record<string, number> = {};
    for (const habit of habits) {
      const habitId = (habit._id as Types.ObjectId).toString();
      counts[habitId] = habit.completedDates.filter(
        (date) => date === today,
      ).length;
    }

    return counts;
  }
}
