import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { email_validator } from './authValidator';

export const validateUserUpdate = [
  email_validator,
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
    .isMobilePhone('any')
    .withMessage('Format nomor HP tidak sesuai'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    next();
  },
];
