import { HttpException } from '@/errors/httpException';
import prisma from '@/prisma';
import promotionQuery from '@/queries/promotionQuery';
import voucherQuery from '@/queries/voucherQuery';
import { HttpStatus } from '@/types/error';
import { $Enums, Voucher } from '@prisma/client';

class VoucherAction {
  public async getVouchersUserAction(id: number): Promise<Voucher[]> {
    const userVouchers = await voucherQuery.getVouchersByUserId(id);

    return userVouchers;
  }

  public async createVoucher(
    promotionId: number,
    customerId: number,
  ): Promise<Voucher> {
    const promotion = await prisma.promotion.findUnique({
      where: {
        id: promotionId,
      },
    });
    if (promotion === null) {
      throw new HttpException(HttpStatus.NOT_FOUND, 'Promosi tidak ditemukan');
    }

    if (promotion.source !== $Enums.PromotionSource.REFEREE_BONUS) {
      const isClaimed = await voucherQuery.isVoucherAlreadyClaimed(
        promotionId,
        customerId,
      );

      if (isClaimed) {
        throw new HttpException(
          HttpStatus.FORBIDDEN,
          'Kupon sudah diklaim sebelumnya',
        );
      }
    }

    const generatedVoucher = await voucherQuery.createVoucherForCustomer(
      promotionId,
      customerId,
    );

    return generatedVoucher;
  }
}

export default new VoucherAction();
