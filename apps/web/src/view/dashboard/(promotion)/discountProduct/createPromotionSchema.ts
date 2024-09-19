import { DiscountType, State } from '@/types/productTypes';
import { z } from 'zod';

export const formSchema = z.object({
  productId: z.string(),
  storeId: z.string(),
  promotionState: z.enum([State.DRAFT, State.PUBLISHED]),
  startedAt: z.string().date(),
  finishedAt: z.string().date(),
  discountType: z.enum([DiscountType.FLAT, DiscountType.PERCENT]),
  discountValue: z
    .number()
    .min(1, 'Kuota harus lebih besar atau sama dengan 1'),
});
