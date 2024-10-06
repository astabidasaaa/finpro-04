import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

export const validateStoreCreate = [
  body('storeName')
    .trim()
    .notEmpty()
    .withMessage('Nama toko wajib diisi')
    .isLength({ min: 1, max: 32 })
    .withMessage('Nama toko maksimal berisi 32 karakter'),
  body('storeState')
    .trim()
    .notEmpty()
    .withMessage('Status toko wajib diisi')
    .isIn(['ARCHIVED', 'DRAFT', 'PUBLISHED'])
    .withMessage('Status toko tidak sesuai'),
  body('storeAddress')
    .isObject()
    .withMessage('Alamat toko harus berupa objek')
    .custom((storeAddress) => {
      if (
        typeof storeAddress.address !== 'string' ||
        typeof storeAddress.latitude !== 'string' ||
        typeof storeAddress.longitude !== 'string'
      ) {
        throw new Error('Alamat toko tidak valid');
      }
      if (
        storeAddress.address.length > 100 ||
        storeAddress.latitude.length > 32 ||
        storeAddress.longitude.length > 32
      ) {
        throw new Error(
          'Alamat maksimal 100 karakter, latitude dan longitude maksimal 32 karakter',
        );
      }
      return true;
    }),
  body('storeAdmins')
    .optional()
    .isArray()
    .withMessage('Admin tidak valid')
    .custom((adminIds) => {
      if (!adminIds.every((id: number) => typeof id === 'number')) {
        throw new Error('Admin tidak valid');
      }
      return true;
    }),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    next();
  },
];

export const validateStoreUpdate = [
  body('storeName')
    .trim()
    .optional()
    .isLength({ min: 1, max: 32 })
    .withMessage('Nama toko maksimal berisi 32 karakter'),
  body('storeState')
    .trim()
    .optional()
    .isIn(['ARCHIVED', 'DRAFT', 'PUBLISHED'])
    .withMessage('Status toko tidak sesuai'),
  body('storeAddress.address')
    .optional()
    .isString()
    .withMessage('Alamat harus berupa string')
    .isLength({ max: 100 })
    .withMessage('Alamat maksimal 100 karakter'),
  body('storeAddress.latitude')
    .optional()
    .isString()
    .withMessage('Latitude harus berupa string')
    .isLength({ max: 32 })
    .withMessage('Latitude maksimal 32 karakter'),
  body('storeAddress.longitude')
    .optional()
    .isString()
    .withMessage('Longitude harus berupa string')
    .isLength({ max: 32 })
    .withMessage('Longitude maksimal 32 karakter'),
  body('storeAdmins')
    .optional()
    .isArray()
    .withMessage('Admin tidak valid')
    .custom((adminIds) => {
      if (!adminIds.every((id: number) => typeof id === 'number')) {
        throw new Error('Admin tidak valid');
      }
      return true;
    }),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    next();
  },
];
