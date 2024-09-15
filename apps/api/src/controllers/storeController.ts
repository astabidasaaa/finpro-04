import verifyEmailAction from '@/actions/verifyEmailAction';
import { User } from '@/types/express';
import { NextFunction, Request, Response } from 'express';

export class StoreController {
  public async getStoresWithQuery(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.user as User;

      res.status(200).json({
        message: 'Berhasil mencari toko',
        data: {},
      });
    } catch (error) {
      next(error);
    }
  }
}
