import { NextFunction, Request, Response } from 'express';
import authAction from '@/actions/authAction';
import { User } from '@/types/express';

export class AuthController {
  public async initiateRegisterCredentials(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email } = req.body;

      await authAction.initiateCreateUserFromCredential(email);

      res.status(200).json({
        message: `Berhasil mengirim pesan konfirmasi`,
      });
    } catch (error) {
      next(error);
    }
  }

  public async registerCredentials(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email } = req.user as User;

      const { password, referrerCode } = req.body;

      const user = await authAction.createUserFromCredential({
        email,
        password,
        referrerCode,
      });

      res.status(201).json({
        message: 'Registrasi berhasil',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  public async loginCredentials(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { password, email } = req.body;

      const accessToken = await authAction.loginCredentials(email, password);

      res.status(200).cookie('access-token', accessToken).json({
        message: 'Login berhasil',
      });
    } catch (error) {
      next(error);
    }
  }

  public async refreshAccessToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email } = req.user as User;

      const accessToken = await authAction.refreshAccessToken(email);

      res.status(200).cookie('access-token', accessToken);
    } catch (error) {
      next(error);
    }
  }
}
