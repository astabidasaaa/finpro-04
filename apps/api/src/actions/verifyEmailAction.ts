import { HttpException } from '@/errors/httpException';
import prisma from '@/prisma';
import authQuery from '@/queries/authQuery';
import { HttpStatus } from '@/types/error';
import { generateRandomToken } from '@/utils/randomToken';
import { verificationMail } from '@/utils/sendMail';
import { compare } from 'bcrypt';

class VerifyEmailAction {
  public async verifyEmailRequest(email: string) {
    const user = await authQuery.findUserAndIsPassword(email);

    if (!user) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Email tidak ditemukan');
    }

    const generate = generateRandomToken(1);

    //   updating verificationToken & verificationTokenExpiry to db then send email to user (atomic)
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          verificationToken: generate.token,
          verificationTokenExpiry: new Date(generate.tokenExpiry),
        },
      });

      await verificationMail(email, generate.token);
    });
  }

  public async verifyEmail(password: string, token: string) {
    const user = await authQuery.findUserByVerificationToken(token);

    // throw error when the returned user is not found or no password
    if (!user || user.password === null)
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'User tidak ditemukan. Silakan ulangi permintaan verifikasi email',
      );

    // check whether the password is valid using compare bcrypt then return boolean
    const isValid = await compare(password, user.password);

    if (!isValid)
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Password salah. Silakan masukkan password kembali',
      );

    await authQuery.verifyUserAndRemoveToken(user.id);
  }
}

export default new VerifyEmailAction();
