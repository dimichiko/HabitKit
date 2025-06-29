import { z } from 'zod';

export const RegisterDto = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
  phone: z.string().optional(),
  role: z.string().default('user').optional(),
  points: z.number().default(0).optional(),
  level: z.number().default(1).optional(),
  plan: z.string().default('Free').optional(),
  subscription: z.record(z.any()).default({}).optional(),
  activeApps: z.array(z.string()).default([]).optional(),
  hasFullHistory: z.boolean().default(false).optional(),
  hasBackups: z.boolean().default(false).optional(),
  adsEnabled: z.boolean().default(true).optional(),
  supportLevel: z.string().default('limited').optional(),
});

export type RegisterDtoType = z.infer<typeof RegisterDto>;
