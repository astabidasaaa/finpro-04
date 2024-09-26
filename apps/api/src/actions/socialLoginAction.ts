import { ACCESS_TOKEN_SECRET, EMAIL_VERIFICATION_SECRET } from '@/config';
import { HttpException } from '@/errors/httpException';
import prisma from '@/prisma';
import authQuery from '@/queries/authQuery';
import { HttpStatus } from '@/types/error';
import { hashingPassword } from '@/utils/password';
import { registrationMail } from '@/utils/sendMail';
import { sign } from 'jsonwebtoken';
import verifyEmailAction from './verifyEmailAction';
import { compare } from 'bcrypt';
import { User } from '@/types/express';

type CreateUserFromCredential = {
  email: string;
  password: string;
  referrerCode: string;
};

type CreateUserFromGoogle = {
  email: string;
  googleId: string;
};

type AccessPayload = {
  id: number;
  email: string;
  role: string;
  isVerified: boolean;
  avatar: string | null | undefined;
};

class SocialAction {
  public async initiateLoginGoogle(props: CreateUserFromGoogle) {
    const { email, googleId } = props;

    const isUser = await authQuery.findUserByEmail(email);

    const accessPayload: AccessPayload = {
      id: 0,
      email: '',
      role: '',
      isVerified: false,
      avatar: '',
    };

    if (isUser) {
      const checkGoogleId = await prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          googleId: true,
        },
      });

      if (checkGoogleId?.googleId && googleId != checkGoogleId.googleId) {
        throw new HttpException(
          HttpStatus.UNAUTHORIZED,
          'User tidak ditemukan',
        );
      }

      const user = await prisma.user.update({
        where: {
          email,
        },
        data: {
          googleId,
          isVerified: true,
        },
        select: {
          id: true,
          email: true,
          role: {
            select: {
              name: true,
            },
          },
          isVerified: true,
          profile: {
            select: {
              avatar: true,
            },
          },
        },
      });

      if (!user) {
        throw new HttpException(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Silakan ulangi proses registrasi',
        );
      }

      accessPayload.id = user.id;
      accessPayload.email = user.email;
      accessPayload.role = user.role.name;
      accessPayload.isVerified = user.isVerified;
      accessPayload.avatar = user.profile?.avatar;
    }

    if (!isUser) {
      const referralCode = await authQuery.generateUniqueReferralCode();

      const user = await prisma.user.create({
        data: {
          email,
          googleId,
          isVerified: true,
          roleId: 1,
          profile: {
            create: {},
          },
          referralCode,
        },
        select: {
          id: true,
          email: true,
          role: {
            select: {
              name: true,
            },
          },
          isVerified: true,
          profile: {
            select: {
              avatar: true,
            },
          },
        },
      });

      if (!user) {
        throw new HttpException(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Silakan ulangi proses registrasi',
        );
      }

      accessPayload.id = user.id;
      accessPayload.email = user.email;
      accessPayload.role = user.role.name;
      accessPayload.isVerified = user.isVerified;
      accessPayload.avatar = user.profile?.avatar;
    }

    return accessPayload;
  }

  public async loginGoogle(accessPayload: User) {
    const accessToken = sign(accessPayload, String(ACCESS_TOKEN_SECRET), {
      expiresIn: '24hr',
    });

    return accessToken;
  }
}

export default new SocialAction();
