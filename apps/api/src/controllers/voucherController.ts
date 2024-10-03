import voucherAction from '@/actions/voucherAction';
import type { User } from '@/types/express';
import type { Request, Response, NextFunction } from 'express';

export class VoucherController {
  public async getVouchersUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.user as User;

      const vouchers = await voucherAction.getVouchersUserAction(id);

      res.status(200).json({
        message: 'Kupon berhasil ditampilkan',
        data: vouchers,
      });
    } catch (err) {
      next(err);
    }
  }

  public async createVoucher(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.user as User;
      const promotionId = parseInt(req.params.promotionId);

      const generatedVoucher = await voucherAction.createClaimableVoucher(
        promotionId,
        id,
      );

      res.status(200).json({
        message: 'Kupon berhasil dibuat',
        data: generatedVoucher,
      });
    } catch (err) {
      next(err);
    }
  }
}
