import { State, DiscountType } from '@/types/productTypes';
import { PromotionType } from '@/types/promotionType';
import { z } from 'zod';

export const formSchema = z.object({
  name: z.string().trim().min(1, 'Nama promosi wajib diisi'),
  promotionState: z.enum([State.DRAFT, State.PUBLISHED]),
  storeId: z.string(),
  description: z.string().trim().min(1, 'Deskripsi produk wajib diisi'),
  startedAt: z.string().date(),
  finishedAt: z.string().date(),
  quota: z.number().min(1, 'Kuota harus lebih besar atau sama dengan 1'),
  promotionType: z.enum([PromotionType.DELIVERY, PromotionType.TRANSACTION]),
  discountType: z.enum([DiscountType.FLAT, DiscountType.PERCENT]),
  discountValue: z
    .number()
    .min(1, 'Kuota harus lebih besar atau sama dengan 1'),
  discountDurationSecs: z
    .number()
    .min(60, 'Durasi harus lebih besar dari 1 menit'),
  minPurchase: z
    .number()
    .positive('Nilai minimal belanja harus positif')
    .optional(),
  maxDeduction: z
    .number()
    .positive('Nilai maksimal pemotongan harus positif')
    .optional(),
});
