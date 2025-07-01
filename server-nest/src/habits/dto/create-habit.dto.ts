import { z } from 'zod';

export const CreateHabitDto = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  color: z.string().optional().default('#4ade80'),
  timesPerDay: z
    .number()
    .min(1, 'Debe completar al menos 1 vez por día')
    .default(1),
  folder: z.string().optional().default(''),
});

export type CreateHabitDtoType = z.infer<typeof CreateHabitDto>;
