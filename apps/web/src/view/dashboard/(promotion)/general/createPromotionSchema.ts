import { State, DiscountType } from '@/types/productTypes';
import { PromotionSource, PromotionType } from '@/types/promotionType';
import { z } from 'zod';

const MAX_UPLOAD_SIZE = 1024 * 1024 * 1;
const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpg', 'image/jpeg'];

export const formSchema = z.object({
  name: z.string().trim().min(1, 'Nama promosi wajib diisi'),
  promotionState: z.enum([State.DRAFT, State.PUBLISHED]),
  source: z.enum([
    PromotionSource.AFTER_MIN_PURCHASE,
    PromotionSource.AFTER_MIN_TRANSACTION,
    PromotionSource.ALL_BRANCH,
    PromotionSource.REFEREE_BONUS,
    PromotionSource.REFERRAL_BONUS,
  ]),
  description: z
    .string()
    .trim()
    .min(1, 'Deskripsi produk wajib diisi')
    .max(190, 'Deskripsi tidak boleh lebih dari 190 karakter'),
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
  isFeatured: z.boolean().default(false),
  minPurchase: z
    .number()
    .positive('Nilai minimal belanja harus positif')
    .optional(),
  maxDeduction: z
    .number()
    .positive('Nilai maksimal pemotongan harus positif')
    .optional(),
  afterMinPurchase: z
    .number()
    .positive('Nilai minimal belanja harus positif')
    .optional(),
  afterMinTransaction: z
    .number()
    .positive('Nilai minimal transaksi harus positif')
    .optional(),
  file: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= MAX_UPLOAD_SIZE, {
      message: 'Ukuran maksimal avatar 1MB',
    })
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file?.type || ''), {
      message: 'Ekstensi file hanya bisa .png, .jpg, atau .jpeg',
    }),
});
