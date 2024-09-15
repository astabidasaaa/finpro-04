import { HttpException } from '@/errors/httpException';
import prisma from '@/prisma';
import authQuery from '@/queries/authQuery';
import { HttpStatus } from '@/types/error';
import { generateRandomToken } from '@/utils/randomToken';
import { verificationMail } from '@/utils/sendMail';

class StoreAction {
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
}

export default new StoreAction();
