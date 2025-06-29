import { Test, TestingModule } from '@nestjs/testing';
import { CaloriesController } from './calories.controller';

describe('CaloriesController', () => {
  let controller: CaloriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CaloriesController],
    }).compile();

    controller = module.get<CaloriesController>(CaloriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
