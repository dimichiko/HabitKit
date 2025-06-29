import {
  Controller,
  Post,
  Get,
  Body,
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
    return this.habitsService.create(body, req.user.userId);
  }

  @Get()
  async findAll(@Request() req: RequestWithUser) {
    return this.habitsService.findAllByUser(req.user.userId);
  }
}
