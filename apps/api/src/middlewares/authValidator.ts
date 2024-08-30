import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

export const validateEmail = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email wajib diisi')
    .isEmail()
    .withMessage('Format email tidak sesuai')
    .isLength({ min: 3, max: 64 })
    .withMessage('Email harus berisi antara 3 hingga 64 karakter')
    .toLowerCase(),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    next();
  },
];

export const validateRegister = [
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password wajib diisi')
    .isLength({ min: 8 })
    .withMessage('Password harus berisi lebih dari 8 karakter'),
  body('referrerCode')
    .if(body('referrerCode').notEmpty())
    .isLength({ max: 8, min: 8 })
    .withMessage('Kode referal tidak sesuai')
    .optional(),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    next();
  },
];

export const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email wajib diisi')
    .isEmail()
    .withMessage('Format email tidak sesuai')
    .isLength({ min: 3, max: 64 })
    .withMessage('Email harus berisi antara 3 hingga 64 karakter')
    .toLowerCase(),
  body('password')
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

// IMPORTANT: for reset password & email verification only!
export const validatePassword = [
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password wajib diisi')
    .isLength({ min: 8 })
    .withMessage('Password harus berisi lebih dari 8 karakter'),
  body('token')
    .notEmpty()
    .withMessage('Token tidak sesuai')
    .isLength({ min: 128, max: 128 })
    .withMessage('Token tidak sesuai'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    next();
  },
];
