import verifyEmailAction from '@/actions/verifyEmailAction';
import { User } from '@/types/express';
import { NextFunction, Request, Response } from 'express';

export class VerifyEmailController {
  public async emailVerificationRequest(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email } = req.user as User;

      await verifyEmailAction.verifyEmailRequest(email);

      res.status(200).json({
        message: 'Permintaan verifikasi email berhasil',
      });
    } catch (error) {
      next(error);
    }
  }

  public async emailVerification(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { password, token } = req.body;

      await verifyEmailAction.verifyEmail(password, token);

      res.status(200).json({
        message: 'Email berhasil diverifikasi',
      });
    } catch (error) {
      next(error);
    }
  }
}
