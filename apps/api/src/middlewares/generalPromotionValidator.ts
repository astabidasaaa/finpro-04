import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { $Enums } from '@prisma/client';
import { HttpStatus } from '@/types/error';
import { deletePhoto } from '@/utils/deletePhoto';

export const promotionStateValidator = body('promotionState')
  .trim()
  .notEmpty()
  .withMessage('Status promotion tidak boleh kosong')
  .bail()
  .custom((value) => Object.values($Enums.State).includes(value))
  .withMessage(
    'Tidak terdapat status yang sesuai. Status promosi harus diantara: DRAFT, PUBLISHED, dan ARCHIVED',
  );

const generalPromotionSourceValidator = body('source')
  .trim()
  .notEmpty()
  .withMessage('Sumber promosi tidak boleh kosong')
  .bail()
  .custom((value) => Object.values($Enums.PromotionSource).includes(value))
  .withMessage(
    'Tidak terdapat sumber promosi yang sesuai. Sumber promosi harus diantara: REFEREE_BONUS, REFERRAL_BONUS, ALL_BRANCH, AFTER_MIN_PURCHASE, dan AFTER_MIN_TRANSACTION',
  )
  .bail()
  .custom((value, { req }) => {
    if (value === $Enums.PromotionSource.AFTER_MIN_TRANSACTION) {
      return req.body.afterMinTransaction === undefined ? false : true;
    }
    return true;
  })
  .withMessage(
    'Sumber promosi setelah minimal transaksi membutuhkan minimal transaksi',
  )
  .bail()
  .custom((value, { req }) => {
    if (value === $Enums.PromotionSource.AFTER_MIN_PURCHASE) {
      return req.body.afterMinPurchase === undefined ? false : true;
    }
    return true;
  })
  .withMessage(
    'Sumber promosi setelah minimal pembelian membutuhkan minimal pembelian',
  );

export const promotionTypeValidator = body('promotionType')
  .trim()
  .notEmpty()
  .withMessage('Tipe promosi tidak boleh kosong')
  .bail()
  .custom((value) => Object.values($Enums.PromotionType).includes(value))
  .withMessage(
    'Tidak terdapat tipe promosi yang sesuai. Tipe promosi harus diantara: DELIVERY dan TRANSACTION',
  );

export const discountTypeValidator = body('discountType')
  .trim()
  .notEmpty()
  .withMessage('Tipe diskon tidak boleh kosong')
  .bail()
  .custom((value) => Object.values($Enums.DiscountType).includes(value))
  .withMessage(
    'Tidak terdapat tipe diskon yang sesuai. Tipe diskon harus diantara: FLAT dan PERCENT',
  );

const generalTypeValidators = [
  generalPromotionSourceValidator,
  promotionStateValidator,
  promotionTypeValidator,
  discountTypeValidator,
];

export const textFieldValidators = [
  body('name').trim().notEmpty().withMessage('Nama wajib diisi'),
  body('description').trim().notEmpty().withMessage('Deskripsi wajib diisi'),
];

export const dateValidators = [
  body('startedAt')
    .notEmpty()
    .withMessage('Tanggal mulai promosi harus diisi')
    .bail()
    .toDate()
    .isISO8601()
    .withMessage('Tanggal mulai promosi tidak sesuai'),
  body('finishedAt')
    .notEmpty()
    .withMessage('Tanggal selesai promosi harus diisi')
    .bail()
    .toDate()
    .isISO8601()
    .withMessage('Tanggal selesai promosi tidak sesuai')
    .bail()
    .custom((value, { req }) => {
      const startedAt = new Date(req.body.startedAt);
      const finishedAt = new Date(value);

      if (finishedAt <= startedAt) {
        return false;
      }
      return true;
    })
    .withMessage(
      'Tanggal promosi berakhir sama atau lebih besar daripada tanggal promosi dimulai',
    ),
];

export const discountValueValidator = body('discountValue')
  .notEmpty()
  .withMessage('Diskon harus diisi')
  .bail()
  .isNumeric()
  .withMessage('Diskon harus dalam bentuk angka')
  .bail()
  .isFloat({ min: 0.01 })
  .withMessage('Nilai diskon harus positif')
  .bail()
  .custom((value, { req }) =>
    req.body.discountType === $Enums.DiscountType.PERCENT ? value < 100 : true,
  )
  .withMessage('Nilai diskon pada tipe diskon persen harus dibawah 100');

export const valueValidators = [
  body('quota')
    .notEmpty()
    .withMessage('Kuota harus diisi')
    .bail()
    .isNumeric()
    .withMessage('Kuota harus dalam bentuk angka')
    .bail()
    .isInt({ min: 1 })
    .withMessage('Kuota tidak boleh kurang dari 1'),
  discountValueValidator,
  body('discountDurationSecs')
    .notEmpty()
    .withMessage('Jangka waktu aktif diskon harus diisi')
    .bail()
    .isNumeric()
    .withMessage('Jangka waktu aktif diskon harus dalam bentuk angka')
    .bail()
    .isInt({ min: 60 })
    .withMessage('Jangka waktu aktif tidak boleh kurang dari 1 menit'),
  body('minPurchase')
    .optional()
    .isNumeric()
    .withMessage('Minimal pembelian harus dalam bentuk angka')
    .bail()
    .isInt({ min: 1 })
    .withMessage('Nominal minimal pembelian harus positif'),
  body('maxDeduction')
    .optional()
    .isNumeric()
    .withMessage('Maksimal pemotongan harga harus dalam bentuk angka')
    .bail()
    .isInt({ min: 1 })
    .withMessage('Nominal potongan maksimal harus positif')
    .bail()
    .custom(
      (value, { req }) => req.body.discountType === $Enums.DiscountType.PERCENT,
    )
    .withMessage('Pemotongan maksimal hanya diisi untuk tipe diskon persen'),
];

const conditionalValidators = [
  body('afterMinPurchase')
    .optional()
    .isNumeric()
    .withMessage('Setelah minimal pembelian harus dalam bentuk angka')
    .bail()
    .custom(
      (value, { req }) =>
        req.body.source === $Enums.PromotionSource.AFTER_MIN_PURCHASE,
    )
    .withMessage(
      'Jumlah minimal pembelian hanya boleh diisi jika sumber promosi AFTER_MIN_PURCHASE',
    ),
  body('afterMinTransaction')
    .optional()
    .isNumeric()
    .withMessage('Setelah minimal transaksi harus dalam bentuk angka')
    .bail()
    .custom(
      (value, { req }) =>
        req.body.source === $Enums.PromotionSource.AFTER_MIN_TRANSACTION,
    )
    .withMessage(
      'Jumlah minimal transaksi hanya boleh diisi jika sumber promosi AFTER_MIN_TRANSACTION',
    ),
];

const isFeaturedValidator = body('isFeatured')
  .notEmpty()
  .withMessage('Tampilkan unggulan harus diisi')
  .isBoolean();

export const validateGeneralPromotionCreation = [
  ...textFieldValidators,
  ...generalTypeValidators,
  ...dateValidators,
  ...valueValidators,
  isFeaturedValidator,
  ...conditionalValidators,

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      if (req.file !== undefined) {
        deletePhoto(req.file.filename, req.file.destination);
      }

      return res
        .status(HttpStatus.VALIDATION_ERROR)
        .json({ errors: errors.array() });
    }

    next();
  },
];
