import { VoucherController } from '@/controllers/voucherController';
import { AuthMiddleware } from '@/middlewares/tokenHandler';
import { Route } from '@/types/express';
import { Router } from 'express';

export class VoucherRouter implements Route {
  readonly router: Router;
  readonly path: string;
  private readonly voucherController: VoucherController;
  private readonly guard: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.voucherController = new VoucherController();
    this.guard = new AuthMiddleware();
    this.path = '/vouchers';
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}/user`,
      this.guard.verifyAccessToken,
      this.voucherController.getVouchersUser,
    );

    this.router.post(
      `${this.path}/:promotionId`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['user']),
      this.voucherController.createVoucher,
    );
  }
}
