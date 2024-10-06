import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';
import { $Enums, type Voucher } from '@prisma/client';
import promotionQuery from '@/queries/promotionQuery';
import voucherQuery from '@/queries/voucherQuery';

class VoucherAction {
  public async getVouchersUserAction(id: number): Promise<Voucher[]> {
    const userVouchers = await voucherQuery.getVouchersByUserId(id);

    return userVouchers;
  }

  private async checkClaimedVoucher(
    promotionId: number,
    customerId: number,
  ): Promise<void> {
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

  public async createVoucher(
    promotionId: number,
    customerId: number,
  ): Promise<Voucher> {
    const promotion =
      await promotionQuery.getNonProductPromotionByPromotionId(promotionId);

    if (promotion === null) {
      throw new HttpException(HttpStatus.NOT_FOUND, 'Promosi tidak ditemukan');
    }

    if (promotion.source !== $Enums.PromotionSource.REFEREE_BONUS) {
      await this.checkClaimedVoucher(promotionId, customerId);
    }

    const generatedVoucher = await voucherQuery.createVoucherForCustomer(
      promotionId,
      customerId,
    );

    return generatedVoucher;
  }

  public async createClaimableVoucher(
    promotionId: number,
    customerId: number,
  ): Promise<Voucher> {
    const promotion =
      await promotionQuery.getNonProductPromotionByPromotionId(promotionId);

    if (
      promotion.source === $Enums.PromotionSource.ALL_BRANCH ||
      promotion.source === $Enums.PromotionSource.PER_BRANCH
    ) {
      await this.checkClaimedVoucher(promotionId, customerId);

      const generatedVoucher = await voucherQuery.createVoucherForCustomer(
        promotionId,
        customerId,
      );

      return generatedVoucher;
    } else {
      throw new HttpException(
        HttpStatus.FORBIDDEN,
        'Tidak dapat klaim kupon dengan promosi ini',
      );
    }
  }
}

export default new VoucherAction();
