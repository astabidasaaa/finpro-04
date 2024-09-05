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
  public async loginGoogle(props: CreateUserFromGoogle) {
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
      const user = await prisma.user.update({
        where: {
          email,
        },
        data: {
          googleId,
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

  public async createUserFromCredential(props: CreateUserFromCredential) {
    const { email, password, referrerCode } = props;

    // check whether email has been used then return boolean (true if used, false if available)
    const isEmailTaken = await authQuery.findUserByEmail(email);

    if (isEmailTaken) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Email sudah digunakan');
    }

    const hashedPassword = await hashingPassword(password);

    // run the loop function for generating and checking the referral code for each registered user then return the referral code
    const referralCode = await authQuery.generateUniqueReferralCode();

    // check whether the referred code is a valid code that belongs to a user then return referrer id
    let referredById = null;
    if (referrerCode) {
      const referralCheck = await authQuery.referrerCheckReturnId(referrerCode);

      referredById = referralCheck;
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        roleId: 1,
        profile: {
          create: {},
        },
        referralCode,
        referredById,
      },
      select: {
        email: true,
      },
    });

    if (!user) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Silakan ulangi proses registrasi',
      );
    }

    await verifyEmailAction.verifyEmailRequest(user.email);

    return user;
  }

  public async loginCredentials(email: string, password: string) {
    const user = await authQuery.findUserByEmail(email);

    if (!user || user.password === null) {
      throw new HttpException(
        HttpStatus.NOT_FOUND,
        'Akun tidak ditemukan. Pastikan email anda benar atau login menggunakan sosial',
      );
    }

    // check whether the password is valid using compare bcrypt then return boolean
    const isValid = await compare(password, user.password);

    if (!isValid)
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Password Anda salah');

    const accessPayload = {
      id: user.id,
      email: user.email,
      role: user.role.name,
      isVerified: user.isVerified,
      avatar: user.profile?.avatar,
    };

    const accessToken = sign(accessPayload, String(ACCESS_TOKEN_SECRET), {
      expiresIn: '24hr',
    });

    return accessToken;
  }
}

export default new SocialAction();
