import verifyEmailAction from '@/actions/verifyEmailAction';
import { HttpException } from '@/errors/httpException';
import authQuery from '@/queries/authQuery';
import { HttpStatus } from '@/types/error';
import { User } from '@/types/express';
import { NextFunction, Request, Response } from 'express';

export class VerifyEmailController {
  public async emailVerificationRequest(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.user as User;

      const userEmail = await authQuery.findUserIdAndIsPassword(id);

      if (!userEmail) {
        throw new HttpException(
          HttpStatus.BAD_REQUEST,
          'Email tidak ditemukan',
        );
      }

      await verifyEmailAction.verifyEmailRequest(userEmail.email);

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
