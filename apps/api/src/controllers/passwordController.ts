import passwordAction from '@/actions/passwordAction';
import { NextFunction, Request, Response } from 'express';

export class PasswordController {
  public async resetPasswordRequest(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email } = req.body;

      await passwordAction.resetRequest(email);

      res.status(200).json({
        message: 'Permintaan atur ulang password berhasil',
      });
    } catch (error) {
      next(error);
    }
  }

  public async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { password, token } = req.body;

      await passwordAction.reset(password, token);

      res.status(200).json({
        message: 'Atur ulang password berhasil',
      });
    } catch (error) {
      next(error);
    }
  }
}
