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
    .string()
    .min(1, 'Nilai diskon tidak boleh kosong')
    .refine((value) => Number(value) >= 1, {
      message: 'Nilai diskon harus lebih besar dari 1',
    })
    .refine((value) => Number.isInteger(Number(value)), {
      message: 'Nilai diskon harus berupa angka bulat',
    }),
});
