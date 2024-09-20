import voucherAction from '@/actions/voucherAction';
import { User } from '@/types/express';
import { Request, Response, NextFunction } from 'express';

export class VoucherController {
  public async getVouchersUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.user as User;

      const brand = await voucherAction.getVouchersUserAction(id);

      res.status(200).json({
        message: 'Kupon berhasil ditampilkan',
        data: brand,
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

      const brand = await voucherAction.createVoucher(promotionId, id);

      res.status(200).json({
        message: 'Kupon berhasil dibuat',
        data: brand,
      });
    } catch (err) {
      next(err);
    }
  }
}
