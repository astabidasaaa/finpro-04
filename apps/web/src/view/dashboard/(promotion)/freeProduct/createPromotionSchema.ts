import { State } from '@/types/productTypes';
import { z } from 'zod';

export const formSchema = z.object({
  productId: z.string(),
  storeId: z.string(),
  promotionState: z.enum([State.DRAFT, State.PUBLISHED]),
  startedAt: z.string().date(),
  finishedAt: z.string().date(),
  buy: z.number().min(1, 'Jumlah beli harus lebih besar atau sama dengan 1'),
  get: z.number().min(1, 'Jumlah gratis harus lebih besar atau sama dengan 1'),
});
