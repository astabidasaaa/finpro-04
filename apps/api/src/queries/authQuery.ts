import prisma from '@/prisma';
import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';
import { generateReferralCode } from '@/utils/referralCode';
import { CreateUserQueryProps } from '@/types/authTypes';
import { $Enums, User } from '@prisma/client';
import promotionQuery from './promotionQuery';
import voucherAction from '@/actions/voucherAction';

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

  public async findUserIdAndIsPassword(id: number) {
    const user = await prisma.user.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (user?.password)
      return { id: user.id, email: user.email, password: user.password };

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

  public async registerUserFromCredential(
    props: CreateUserQueryProps,
  ): Promise<{ email: string; id: number }> {
    const { email, password, referralCode, referredById } = props;
    const registeredUser = await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          email,
          password,
          roleId: 1,
          profile: {
            create: {},
          },
          referralCode,
          referredById,
        },
        select: {
          id: true,
          email: true,
        },
      });

      if (referredById !== null) {
        const refereePromotion =
          await promotionQuery.getActiveGeneralPromotionBySource(
            $Enums.PromotionSource.REFEREE_BONUS,
          );
        if (refereePromotion.length > 0) {
          await voucherAction.createVoucher(
            refereePromotion[0].id,
            referredById,
          );
        }
      }

      return user;
    });

    return registeredUser;
  }
}

export default new AuthQuery();
