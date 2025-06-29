import { z } from 'zod';

export const CreateInvoiceDto = z.object({
  clientName: z.string().min(1),
  clientEmail: z.string().email().optional(),
  items: z.array(
    z.object({
      description: z.string().min(1),
      quantity: z.number().positive(),
      price: z.number().positive(),
    }),
  ),
  total: z.number().positive(),
});

export type CreateInvoiceDtoType = z.infer<typeof CreateInvoiceDto>;
