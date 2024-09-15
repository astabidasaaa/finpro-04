import { NextFunction, Request, Response } from 'express';
import {
  body,
  check,
  ValidationChain,
  validationResult,
} from 'express-validator';
import { $Enums } from '@prisma/client';

const validateUpdateType = (): ValidationChain => {
  return check('updateType')
    .custom((value) => {
      // Check if the value is a valid enum value
      return Object.values($Enums.InventoryUpdateType).includes(value);
    })
    .withMessage(
      'Tidak terdapat tipe perubahan yang sesuai. Tipe perubahan harus diantara: ADD dan REMOVE.',
    );
};

const validateUpdateDetail = (): ValidationChain => {
  return check('updateDetail')
    .custom((value) => {
      // Check if the value is a valid enum value
      return Object.values($Enums.InventoryUpdateDetail).includes(value);
    })
    .withMessage(
      'Tidak terdapat detail perubahan yang sesuai. Detail perubahan harus diantara: STOCK_IN, STOCK_OUT, ADJUSTMENT, EXPIRATION, DAMAGED, dan CANCELLED_ORDER.',
    );
};

export const validateInventoryChangeCreation = [
  body('productId').isNumeric().notEmpty().withMessage('ID produk wajib diisi'),
  body('storeId').isNumeric().notEmpty().withMessage('ID toko wajib diisi'),
  body('updateType')
    .trim()
    .notEmpty()
    .withMessage('Tipe perubahan wajib diisi'),
  body('updateDetail')
    .trim()
    .notEmpty()
    .withMessage('Detail perubahan wajib diisi'),
  body('description').trim().optional(),
  body('stockChange')
    .isNumeric()
    .notEmpty()
    .withMessage('Perubahan stock wajib diisi'),

  validateUpdateType(),
  validateUpdateDetail(),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    next();
  },
];
