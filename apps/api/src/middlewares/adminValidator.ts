import { NextFunction, Request, Response } from 'express';
import {
  body,
  check,
  ValidationChain,
  validationResult,
} from 'express-validator';
import { AdminRole } from '@/types/adminTypes';

const validateUserRole = (): ValidationChain => {
  return check('role')
    .custom((value) => {
      // Check if the value is a valid enum value
      return Object.values(AdminRole).includes(value);
    })
    .withMessage(
      'Tidak terdapat role yang sesuai. Role harus diantara: user, store admin, super admin.',
    );
};

export const validateAdminCreation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email wajib diisi')
    .isEmail()
    .withMessage('Format email tidak sesuai')
    .isLength({ min: 3, max: 48 })
    .withMessage('Email harus berisi antara 3 hingga 48 karakter')
    .toLowerCase(),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Nama wajib diisi')
    .isLength({ max: 48 })
    .withMessage('Nama berisi maksimal 48 karakter'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password wajib diisi')
    .isLength({ min: 8 })
    .withMessage('Password harus berisi lebih dari 8 karakter'),
  body('role').trim().notEmpty().withMessage('Role wajib diisi'),
  body('storeId').optional().isNumeric(),

  validateUserRole(),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    next();
  },
];

export const validateAdminUpdate = [
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
  body('role').trim().optional(),
  body('storeId').optional().isNumeric(),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    next();
  },
];

export const validateChangeAdminPassword = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email wajib diisi')
    .isEmail()
    .withMessage('Format email tidak sesuai')
    .isLength({ min: 3, max: 48 })
    .withMessage('Email harus berisi antara 3 hingga 48 karakter')
    .toLowerCase(),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password wajib diisi')
    .isLength({ min: 8 })
    .withMessage('Password harus berisi lebih dari 8 karakter'),
  body('newPassword')
    .trim()
    .notEmpty()
    .withMessage('Password wajib diisi')
    .isLength({ min: 8 })
    .withMessage('Password harus berisi lebih dari 8 karakter'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    next();
  },
];
