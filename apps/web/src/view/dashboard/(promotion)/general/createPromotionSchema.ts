import { State, DiscountType } from '@/types/productTypes';
import { PromotionSource, PromotionType } from '@/types/promotionType';
import { z } from 'zod';

const MAX_UPLOAD_SIZE = 1024 * 1024 * 1;
const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpg', 'image/jpeg'];

export const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nama promosi wajib diisi')
    .max(190, 'Nama promosi tidak boleh lebih dari 190 karakter'),
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
  startedAt: z.string().date('Tanggal mulai promosi tidak boleh kosong'),
  finishedAt: z.string().date('Tanggal selesai promosi tidak boleh kosong'),
  quota: z
    .string()
    .min(1, 'Kuota tidak boleh kosong')
    .refine((value) => Number(value) >= 1, {
      message: 'Kuota harus lebih besar dari 0',
    })
    .refine((value) => Number.isInteger(Number(value)), {
      message: 'Kuota harus berupa angka bulat',
    }),
  promotionType: z.enum([PromotionType.DELIVERY, PromotionType.TRANSACTION]),
  discountType: z.enum([DiscountType.FLAT, DiscountType.PERCENT]),
  discountValue: z
    .string()
    .min(1, 'Nilai diskon tidak boleh kosong')
    .refine((value) => Number(value) >= 1, {
      message: 'Nilai diskon harus lebih besar dari 0',
    })
    .refine((value) => Number.isInteger(Number(value)), {
      message: 'Nilai diskon harus berupa angka bulat',
    }),
  discountDurationSecs: z
    .number()
    .min(60, 'Durasi harus lebih besar dari 1 menit'),
  isFeatured: z.boolean().default(false),
  minPurchase: z
    .string()
    .optional()
    .refine((value) => value === '' || Number(value) > 0, {
      message: 'Minimal pembelian harus lebih besar dari 0',
    })
    .refine((value) => value === '' || Number.isInteger(Number(value)), {
      message: 'Minimal pembelian harus berupa angka bulat',
    }),
  maxDeduction: z
    .string()
    .optional()
    .refine((value) => value === '' || Number(value) > 0, {
      message: 'Maksimal potongan harus lebih besar dari 0',
    })
    .refine((value) => value === '' || Number.isInteger(Number(value)), {
      message: 'Maksimal potongan harus berupa angka bulat',
    }),
  afterMinPurchase: z
    .string()
    .optional()
    .refine((value) => value === '' || Number(value) > 0, {
      message: 'Nilai minimal belanja harus lebih besar dari 0',
    })
    .refine((value) => value === '' || Number.isInteger(Number(value)), {
      message: 'Nilai minimal belanja harus berupa angka bulat',
    }),
  afterMinTransaction: z
    .string()
    .optional()
    .refine((value) => value === '' || Number(value) > 0, {
      message: 'Minimal transaksi harus lebih besar dari 0',
    })
    .refine((value) => value === '' || Number.isInteger(Number(value)), {
      message: 'Minimal transaksi harus berupa angka bulat',
    }),
  file: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => {
        if (!file) return true;
        return file.size <= MAX_UPLOAD_SIZE;
      },
      {
        message: 'Ukuran maksimal avatar 1MB',
      },
    )
    .refine(
      (file) => {
        if (!file) return true;
        return ACCEPTED_FILE_TYPES.includes(file.type);
      },
      {
        message: 'Ekstensi file hanya bisa .png, .jpg, atau .jpeg',
      },
    ),
});
