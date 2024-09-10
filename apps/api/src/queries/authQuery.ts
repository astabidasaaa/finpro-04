import prisma from '@/prisma';
import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';
import { generateReferralCode } from '@/utils/referralCode';

class AuthQuery {
  // IMPORTANT: for validating & checking purpose only! check whether the email is already used then return { id, email? } or null if no user found
  public async findUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        password: true,
        isVerified: true,
        profile: {
          select: {
            avatar: true,
          },
        },
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    return user;
  }

  // IMPORTANT: for validating & checking purpose only! check whether the email is already used then return { id, email? } or null if no user found
  public async findUserAndIsPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (user?.password) return { id: user.id };

    return null;
  }

  // check whether the referral code is already used. if used it will re-generate and re-checked the code until the unique code found then return the code
  public async generateUniqueReferralCode() {
    let code;
    let isUnique = false;

    while (!isUnique) {
      code = generateReferralCode();
      const existingUser = await prisma.user.findUnique({
        where: { referralCode: code, deletedAt: null },
      });

      if (!existingUser) {
        isUnique = true;
      }
    }

    if (!code) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Terjadi kesalahan. Silakan ulangi submit',
      );
    }

    return code;
  }

  // find user based on referrer code then return the referrer id
  public async referrerCheckReturnId(referrerCode: string) {
    const referrerValidation = await prisma.user.findFirst({
      select: {
        id: true,
      },
      where: {
        referralCode: referrerCode,
        deletedAt: null,
      },
    });

    if (!referrerValidation)
      throw new HttpException(
        HttpStatus.NOT_FOUND,
        'Kode referral tidak ditemukan. Gunakan kode referral yang valid atau kosongkan kolom',
      );

    return referrerValidation.id;
  }

  public async findUserByVerificationToken(token: string) {
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpiry: {
          gt: new Date(),
        },
        deletedAt: null,
      },
      select: {
        id: true,
        password: true,
      },
    });

    return user;
  }

  public async verifyUserAndRemoveToken(id: number) {
    const isSuccess = await prisma.user.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    });

    if (!isSuccess)
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Silakan ulangi permintaan verifikasi email',
      );
  }
}

export default new AuthQuery();
