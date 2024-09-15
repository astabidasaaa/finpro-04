import { NextFunction, Request, Response } from 'express';
import {
  body,
  check,
  ValidationChain,
  validationResult,
} from 'express-validator';
import { $Enums } from '@prisma/client';

const promotionStateValidator = body('promotionState')
  .trim()
  .notEmpty()
  .withMessage('Status promotion tidak boleh kosong')
  .custom((value) => Object.values($Enums.State).includes(value))
  .withMessage(
    'Tidak terdapat status yang sesuai. Status promosi harus diantara: DRAFT, PUBLISHED, dan ARCHIVED',
  );

const promotionSourceValidator = body('source')
  .trim()
  .notEmpty()
  .withMessage('Sumber promosi tidak boleh kosong')
  .custom((value) => Object.values($Enums.PromotionSource).includes(value))
  .withMessage(
    'Tidak terdapat sumber promosi yang sesuai. Sumber promosi harus diantara: REFEREE_BONUS, REFERRAL_BONUS, ALL_BRANCH, AFTER_MIN_PURCHASE, dan AFTER_MIN_TRANSACTION',
  );

const promotionTypeValidator = body('promotionType')
  .trim()
  .notEmpty()
  .withMessage('Tipe promosi tidak boleh kosong')
  .custom((value) => Object.values($Enums.PromotionType).includes(value))
  .withMessage(
    'Tidak terdapat tipe promosi yang sesuai. Tipe promosi harus diantara: DELIVERY dan TRANSACTION',
  );

const discountTypeValidator = body('discountType')
  .trim()
  .notEmpty()
  .withMessage('Tipe diskon tidak boleh kosong')
  .custom((value) => Object.values($Enums.DiscountType).includes(value))
  .withMessage(
    'Tidak terdapat tipe diskon yang sesuai. Tipe diskon harus diantara: FLAT dan PERCENT',
  );

const typeValidators = [
  promotionSourceValidator,
  promotionStateValidator,
  promotionTypeValidator,
  discountTypeValidator,
];

const textFieldValidators = [
  body('name').trim().notEmpty().withMessage('Nama wajib diisi'),
  body('description').trim().notEmpty().withMessage('Deskripsi wajib diisi'),
];

const dateValidators = [
  body('startedAt')
    .notEmpty()
    .withMessage('Tanggal mulai promosi harus diisi')
    .toDate()
    .isISO8601()
    .withMessage('Tanggal mulai promosi tidak sesuai'),
  body('finishedAt')
    .notEmpty()
    .withMessage('Tanggal selesai promosi harus diisi')
    .toDate()
    .isISO8601()
    .withMessage('Tanggal selesai promosi tidak sesuai'),
];

const valueValidators = [
  body('quota')
    .isNumeric()
    .withMessage('Kuota harus dalam bentuk angka')
    .notEmpty()
    .withMessage('Kuota harus diisi'),
  body('discountValue')
    .isNumeric()
    .withMessage('Diskon harus dalam bentuk angka')
    .notEmpty()
    .withMessage('Diskon harus diisi'),
  body('discountDurationSecs')
    .isNumeric()
    .withMessage('Jangka waktu aktif diskon harus dalam bentuk angka')
    .notEmpty()
    .withMessage('Jangka waktu aktif diskon harus diisi'),
  body('minPurchase')
    .optional()
    .isNumeric()
    .withMessage('Minimal pembelian harus dalam bentuk angka'),
  body('maxDeduction')
    .optional()
    .isNumeric()
    .withMessage('Maksimal pemotongan harga harus dalam bentuk angka'),
];

const conditionalValidators = [
  body('afterMinPurchase')
    .optional()
    .isNumeric()
    .withMessage('Setelah minimal pembelian harus dalam bentuk angka')
    .custom(
      ({ req }) =>
        req.body.source === $Enums.PromotionSource.AFTER_MIN_PURCHASE,
    )
    .withMessage(
      'Jumlah minimal pembelian hanya boleh diisi jika sumber promosi AFTER_MIN_PURCHASE',
    ),
  body('afterMinTransaction')
    .optional()
    .isNumeric()
    .withMessage('Setelah minimal transaksi harus dalam bentuk angka')
    .custom(
      ({ req }) =>
        req.body.source === $Enums.PromotionSource.AFTER_MIN_TRANSACTION,
    )
    .withMessage(
      'Jumlah minimal transaksi hanya boleh diisi jika sumber promosi AFTER_MIN_TRANSACTION',
    ),
];

const isFeaturedValidator = body('isFeatured')
  .isBoolean()
  .notEmpty()
  .withMessage('Tampilkan unggulan harus diisi');

export const validateGeneralPromotionChangeCreation = [
  textFieldValidators,
  typeValidators,
  dateValidators,
  valueValidators,
  isFeaturedValidator,
  conditionalValidators,

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  },
];
