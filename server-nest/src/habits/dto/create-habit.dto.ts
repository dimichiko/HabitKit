import { z } from 'zod';

export const CreateHabitDto = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

export type CreateHabitDtoType = z.infer<typeof CreateHabitDto>;
