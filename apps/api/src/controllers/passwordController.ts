import passwordAction from '@/actions/passwordAction';
import { User } from '@/types/express';
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

  public async changePassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.user as User;

      const { password, newPassword } = req.body;

      await passwordAction.change(id, password, newPassword);

      res.status(200).json({
        message: 'Password berhasil diubah',
      });
    } catch (error) {
      next(error);
    }
  }

  public async addPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email } = req.user as User;

      const { newPassword } = req.body;

      const test = await passwordAction.add(email, newPassword);

      res.status(200).json({
        message: 'Password berhasil ditambahkan',
        data: { test },
      });
    } catch (error) {
      next(error);
    }
  }
}
