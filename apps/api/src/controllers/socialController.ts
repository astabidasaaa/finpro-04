import { NextFunction, Request, Response } from 'express';
import authAction from '@/actions/authAction';
import { User } from '@/types/express';

export class SocialController {
  public async loginGoogleCallback(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      //   const { email } = req.body;

      //   await authAction.initiateCreateUserFromCredential(email);
      console.log('berhasil login DENGAN google');

      res.status(200).json({
        message: `Berhasil login DENGAN google`,
      });
    } catch (error) {
      next(error);
    }
  }

  //   (req: Request, res: Response) => {
  //         // Extract user and JWT token from req.user
  //         const { user, token } = req.user as { user: any; token: string };

  //         // Send the token and user data back to the client
  //         res.json({
  //           message: 'Logged in successfully',
  //           token,
  //           user,
  //         });
  //       },
}
