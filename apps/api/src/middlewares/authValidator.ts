import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

export const email_validator = body('email')
  .trim()
  .notEmpty()
  .withMessage('Email wajib diisi')
  .isEmail()
  .withMessage('Format email tidak sesuai')
  .isLength({ min: 3, max: 48 })
  .withMessage('Email harus berisi antara 3 hingga 48 karakter')
  .toLowerCase();

export const password_validator = body('password')
  .trim()
  .notEmpty()
  .withMessage('Password wajib diisi')
  .isLength({ min: 8 })
  .withMessage('Password harus berisi lebih dari 8 karakter');

export const new_password_validator = body('newPassword')
  .trim()
  .notEmpty()
  .withMessage('Password wajib diisi')
  .isLength({ min: 8 })
  .withMessage('Password harus berisi lebih dari 8 karakter');

export const token_validator = body('token')
  .notEmpty()
  .withMessage('Token tidak sesuai')
  .isLength({ min: 128, max: 128 })
  .withMessage('Token tidak sesuai');

export const referrer_code_validator = body('referrerCode')
  .if(body('referrerCode').notEmpty())
  .isLength({ max: 8, min: 8 })
  .withMessage('Kode referal tidak sesuai')
  .optional();

export const validateEmail = [
  email_validator,

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    next();
  },
];

export const validateRegister = [
  password_validator,
  referrer_code_validator,
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    next();
  },
];

export const validateLogin = [
  email_validator,
  password_validator,

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
  password_validator,
  token_validator,

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    next();
  },
];

export const validateChangePassword = [
  password_validator,
  new_password_validator,
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    next();
  },
];
