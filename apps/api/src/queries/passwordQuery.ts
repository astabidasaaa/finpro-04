import prisma from '@/prisma';
import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';

class PasswordQuery {
  public async findUserByResetPasswordToken(token: string) {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordTokenExpiry: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        password: true,
      },
    });

    return user;
  }

  public async resetPasswordAndRemoveToken(id: number, password: string) {
    const isSuccess = await prisma.user.update({
      where: {
        id,
      },
      data: {
        password,
        resetPasswordToken: null,
        resetPasswordTokenExpiry: null,
      },
    });

    if (!isSuccess)
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Silakan ulangi permintaan atur ulang password',
      );
  }

  public async changePassword(email: string, newPassword: string) {
    const isSuccess = await prisma.user.update({
      where: {
        email,
      },
      data: {
        password: newPassword,
      },
    });

    if (!isSuccess)
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Silakan ulangi permintaan ubah password',
      );
  }
}

export default new PasswordQuery();
