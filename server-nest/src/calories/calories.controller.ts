import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CaloriesService } from './calories.service';
import { CreateMealDtoType } from './dto/create-meal.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: { userId: string; email: string };
}

@Controller('calories')
@UseGuards(JwtAuthGuard)
export class CaloriesController {
  constructor(private readonly caloriesService: CaloriesService) {}

  @Post()
  async create(
    @Body() body: CreateMealDtoType,
    @Request() req: RequestWithUser,
  ) {
    return this.caloriesService.create(body, req.user.userId);
  }

  @Get()
  async findAll(@Request() req: RequestWithUser) {
    return this.caloriesService.findAllByUser(req.user.userId);
  }
}
