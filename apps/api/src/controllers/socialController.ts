import { NextFunction, Request, Response } from 'express';
import authAction from '@/actions/authAction';
import { User } from '@/types/express';
import { FRONTEND_URL } from '@/config';
import socialLoginAction from '@/actions/socialLoginAction';

export class SocialController {
  public async loginGoogleCallback(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const accessPayload = req.user as User;

      const accessToken = await socialLoginAction.loginGoogle(accessPayload);

      res.status(301).redirect(`${FRONTEND_URL}/redirect?token=${accessToken}`);
    } catch (error) {
      next(error);
    }
  }

  public async loginGoogleFailure(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const message = 'Gagal mengautentikasi menggunakan Google';

      res
        .status(301)
        .redirect(
          `${FRONTEND_URL}/redirect?error=${encodeURIComponent(message)}`,
        );
    } catch (error) {
      next(error);
    }
  }
}
