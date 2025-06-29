import { z } from 'zod';

export const CreateMealDto = z.object({
  name: z.string().min(1),
  calories: z.number().positive(),
  protein: z.number().min(0).optional(),
  carbs: z.number().min(0).optional(),
  fat: z.number().min(0).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  mealType: z
    .enum(['breakfast', 'lunch', 'dinner', 'snack', 'other'])
    .optional(),
});

export type CreateMealDtoType = z.infer<typeof CreateMealDto>;
