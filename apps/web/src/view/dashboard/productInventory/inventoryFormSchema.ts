import { z } from 'zod';
import { UpdateDetail, UpdateType } from '@/types/inventoryType';

export const formSchema = z.object({
  stockChange: z
    .string()
    .min(1, 'Perubahan stok tidak boleh kosong')
    .refine((value) => Number(value) >= 1, {
      message: 'Perubahan stok harus lebih besar dari 0',
    })
    .refine((value) => Number.isInteger(Number(value)), {
      message: 'Nilai diskon harus berupa angka bulat',
    }),
  description: z.string().trim().optional(),
  updateType: z.enum([UpdateType.ADD, UpdateType.REMOVE]),
  updateDetail: z.enum([
    UpdateDetail.ADJUSTMENT,
    UpdateDetail.CANCELLED_ORDER,
    UpdateDetail.DAMAGED,
    UpdateDetail.EXPIRATION,
    UpdateDetail.STOCK_IN,
    UpdateDetail.STOCK_OUT,
  ]),
  storeId: z.string(),
  productId: z.string(),
});
