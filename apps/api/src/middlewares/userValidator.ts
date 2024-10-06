import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const addressId_validator = body('addressId')
  .trim()
  .toInt()
  .notEmpty()
  .withMessage('ID alamat wajib diisi')
  .isLength({ min: 1, max: 64 })
  .withMessage('ID alamat berisi maksimal 64 angka');

export const validateUserUpdate = [
  body('email')
    .trim()
    .optional()
    .isEmail()
    .withMessage('Format email tidak sesuai')
    .isLength({ min: 3, max: 48 })
    .withMessage('Email harus berisi antara 3 hingga 48 karakter')
    .toLowerCase(),
  body('name')
    .trim()
    .optional()
    .isLength({ max: 48 })
    .withMessage('Nama berisi maksimal 48 karakter'),
  body('dob')
    .trim()
    .optional()
    .toDate()
    .isISO8601()
    .withMessage('Tanggal lahir tidak sesuai'),
  body('phone')
    .trim()
    .optional()
    .customSanitizer((value) => value.replace(/\s+/g, ''))
    .matches(/^\+?\d{8,15}$/)
    .withMessage(
      'Nomor HP hanya dapat berisi angka dan tanda + pada awal nomor',
    ),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    next();
  },
];

export const validateAddressCreate = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Label alamat wajib diisi')
    .isLength({ min: 1, max: 32 })
    .withMessage('Label alamat maksimal berisi 32 karakter'),
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Alamat wajib diisi')
    .isLength({ min: 1, max: 80 })
    .withMessage('Alamat maksimal berisi 80 karakter'),
  body('zipCode')
    .trim()
    .toInt()
    .notEmpty()
    .withMessage('Kode pos wajib diisi')
    .isLength({ min: 1, max: 8 })
    .withMessage('Kode pos berisi maksimal 8 angka'),
  body('latitude')
    .trim()
    .notEmpty()
    .withMessage('Latitude wajib diisi')
    .isLength({ min: 1, max: 32 })
    .withMessage('Latitude berisi maksimal 32 angka'),
  body('longitude')
    .trim()
    .notEmpty()
    .withMessage('Longitude wajib diisi')
    .isLength({ min: 1, max: 32 })
    .withMessage('Longitude berisi maksimal 32 angka'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    next();
  },
];

export const validateAddressUpdate = [
  body('name')
    .trim()
    .optional()
    .isLength({ min: 1, max: 32 })
    .withMessage('Label alamat maksimal berisi 32 karakter'),
  body('address')
    .trim()
    .optional()
    .isLength({ min: 1, max: 80 })
    .withMessage('Alamat maksimal berisi 80 karakter'),
  body('zipCode')
    .trim()
    .optional()
    .toInt()
    .isLength({ min: 1, max: 8 })
    .withMessage('Kode pos berisi maksimal 8 angka'),
  body('latitude')
    .trim()
    .optional()
    .isLength({ min: 1, max: 32 })
    .withMessage('Latitude berisi maksimal 32 angka'),
  body('longitude')
    .trim()
    .optional()
    .isLength({ min: 1, max: 32 })
    .withMessage('Longitude berisi maksimal 32 angka'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    next();
  },
];
