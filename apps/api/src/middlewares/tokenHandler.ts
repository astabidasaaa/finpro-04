import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { User } from '@/types/express';
import {
  ACCESS_TOKEN_SECRET,
  EMAIL_VERIFICATION_SECRET,
  REFRESH_TOKEN_SECRET,
} from '../config';
import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';

export class AuthMiddleware {
  // for verifying if the request coming from authenticated user whatever the role
  // token is passed from header
  public verifyAccessToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const accessToken = req.header('Authorization')?.replace('Bearer ', '');

      if (!accessToken)
        throw new HttpException(
          HttpStatus.FORBIDDEN,
          'Silakan login untuk mengakses',
        );

      try {
        const isToken = verify(accessToken, String(ACCESS_TOKEN_SECRET));

        req.user = isToken as User;
      } catch (error: any) {
        throw new HttpException(HttpStatus.UNAUTHORIZED, error.message);
      }

      next();
    } catch (error) {
      next(error);
    }
  };

  public verifyRegistrationToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const registrationToken = req
      .header('Authorization')
      ?.replace('Bearer ', '');
    try {
      if (!registrationToken)
        throw new HttpException(
          HttpStatus.FORBIDDEN,
          'Silakan login untuk mengakses',
        );

      try {
        const isToken = verify(
          registrationToken,
          String(EMAIL_VERIFICATION_SECRET),
        );

        req.user = isToken as User;
      } catch (error: any) {
        throw new HttpException(HttpStatus.UNAUTHORIZED, error.message);
      }

      next();
    } catch (error) {
      next(error);
    }
  };

  public verifyRole = (requiredRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = req.user as User;

        if (!user)
          throw new HttpException(
            HttpStatus.FORBIDDEN,
            'Silakan login untuk mengakses',
          );

        if (!requiredRoles.includes(user.role)) {
          throw new HttpException(HttpStatus.UNAUTHORIZED, 'Akses ditolak');
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  };
}
