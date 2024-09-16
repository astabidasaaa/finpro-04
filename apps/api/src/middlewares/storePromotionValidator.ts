import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import {
  promotionStateValidator,
  promotionTypeValidator,
  discountTypeValidator,
  textFieldValidators,
  dateValidators,
  valueValidators,
  discountValueValidator,
} from './generalPromotionValidator';

const buyNgetNValidators = [
  body('buy')
    .notEmpty()
    .withMessage('Jumlah beli harus diisi')
    .isNumeric()
    .withMessage('Jumlah beli harus dalam bentuk angka'),
  body('get')
    .notEmpty()
    .withMessage('Jumlah dapat harus diisi')
    .isNumeric()
    .withMessage('Jumlah dapat harus dalam bentuk angka'),
];

const storeIdValidator = body('storeId')
  .notEmpty()
  .withMessage('Toko harus dipilih')
  .isNumeric()
  .withMessage('ID toko harus dalam bentuk angka');

const productIdValidator = body('productId')
  .notEmpty()
  .withMessage('Produk harus dipilih')
  .isNumeric()
  .withMessage('ID produk harus dalam bentuk angka');

const storeTypeValidators = [
  storeIdValidator,
  promotionStateValidator,
  promotionTypeValidator,
  discountTypeValidator,
];

export const validateStorePromotionCreation = [
  ...storeTypeValidators,
  ...textFieldValidators,
  ...dateValidators,
  ...valueValidators,

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  },
];

export const validateFreeProductPromotionCreation = [
  promotionStateValidator,
  ...dateValidators,
  storeIdValidator,
  productIdValidator,
  ...buyNgetNValidators,

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  },
];

export const validateDiscountProductPromotionCreation = [
  promotionStateValidator,
  ...dateValidators,
  storeIdValidator,
  productIdValidator,
  discountTypeValidator,
  discountValueValidator,

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  },
];
