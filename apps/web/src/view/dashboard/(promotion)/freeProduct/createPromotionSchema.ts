import { State } from '@/types/productTypes';
import { z } from 'zod';

export const formSchema = z.object({
  productId: z.string(),
  storeId: z.string(),
  promotionState: z.enum([State.DRAFT, State.PUBLISHED]),
  startedAt: z.string().date(),
  finishedAt: z.string().date(),
  buy: z
    .string()
    .min(1, 'Jumlah beli tidak boleh kosong')
    .refine((value) => Number(value) >= 1, {
      message: 'Jumlah beli harus sama atau lebih besar daripada 1',
    })
    .refine((value) => Number.isInteger(Number(value)), {
      message: 'Jumlah beli harus berupa angka bulat',
    }),
  get: z
    .string()
    .min(1, 'Jumlah gratis tidak boleh kosong')
    .refine((value) => Number(value) >= 1, {
      message: 'Jumlah gratis harus sama atau lebih besar daripada 1',
    })
    .refine((value) => Number.isInteger(Number(value)), {
      message: 'Jumlah gratis harus berupa angka bulat',
    }),
});
