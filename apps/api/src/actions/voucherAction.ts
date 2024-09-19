import { HttpException } from '@/errors/httpException';
import voucherQuery from '@/queries/voucherQuery';
import { HttpStatus } from '@/types/error';
import { Voucher } from '@prisma/client';

class VoucherAction {
  public async getVouchersUserAction(id: number): Promise<Voucher[]> {
    const userVouchers = await voucherQuery.getVouchersByUserId(id);

    return userVouchers;
  }

  public async createVoucher(
    promotionId: number,
    customerId: number,
  ): Promise<Voucher> {
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

    const generatedVoucher = await voucherQuery.createVoucherForCustomer(
      promotionId,
      customerId,
    );

    return generatedVoucher;
  }
}

export default new VoucherAction();
