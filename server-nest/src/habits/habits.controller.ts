import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { HabitsService } from './habits.service';
import { CreateHabitDtoType } from './dto/create-habit.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: { userId: string; email: string };
}

@Controller('habits')
@UseGuards(JwtAuthGuard)
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post()
  async create(
    @Body() body: CreateHabitDtoType,
    @Request() req: RequestWithUser,
  ) {
    console.log('HabitsController - create llamado con:', {
      body,
      userId: req.user.userId,
    });
    const result = await this.habitsService.create(body, req.user.userId);
    console.log('HabitsController - hábito creado:', result);
    return result;
  }

  @Get()
  async findAll(@Request() req: RequestWithUser) {
    return this.habitsService.findAllByUser(req.user.userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<CreateHabitDtoType>,
    @Request() req: RequestWithUser,
  ) {
    return this.habitsService.update(id, body, req.user.userId);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ) {
    return this.habitsService.remove(id, req.user.userId);
  }

  @Post(':id/checkin')
  async checkin(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ) {
    return this.habitsService.addCheckin(id, req.user.userId);
  }

  @Get(':id/checkins')
  async getCheckins(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ) {
    return this.habitsService.getCheckins(id, req.user.userId);
  }

  @Get(':id/stats')
  async getStats(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ) {
    return this.habitsService.getStats(id, req.user.userId);
  }

  @Get('folders')
  async getFolders(@Request() req: RequestWithUser) {
    return this.habitsService.getFolders(req.user.userId);
  }

  @Post('folders')
  async createFolder(
    @Body() body: { name: string },
    @Request() req: RequestWithUser,
  ) {
    console.log('HabitsController - createFolder llamado con:', {
      body,
      userId: req.user.userId,
    });
    const result = await this.habitsService.createFolder(body.name, req.user.userId);
    console.log('HabitsController - carpeta creada:', result);
    return result;
  }

  @Delete('folders/:id')
  async deleteFolder(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ) {
    return this.habitsService.deleteFolder(id, req.user.userId);
  }

  @Post('checkins/counts')
  async getCheckinCounts(
    @Body() body: { habitIds: string[] },
    @Request() req: RequestWithUser,
  ) {
    return this.habitsService.getCheckinCounts(body.habitIds, req.user.userId);
  }
}
