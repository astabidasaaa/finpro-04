import userAction from '@/actions/userAction';
import { User } from '@/types/express';
import { NextFunction, Request, Response } from 'express';

export class UserController {
  public async getSelfProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.user as User;

      const result = await userAction.getSelfProfile(id);

      res.status(200).json({
        message: `Profil pengguna`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateSelfProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.user as User;

      const { file } = req;
      const { email, name, phone, dob } = req.body;

      await userAction.updateSelfProfile({
        id,
        email,
        avatar: file?.filename,
        name,
        phone,
        dob,
      });

      res.status(200).json({
        message: `Update profil berhasil`,
      });
    } catch (error) {
      next(error);
    }
  }
}
