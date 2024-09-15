import { PromotionController } from '@/controllers/promotionController';
import { uploader } from '@/libs/uploader';
import {
  validateGeneralPromotionCreation,
  validateStorePromotionCreation,
} from '@/middlewares/promotionValidator';
import { AuthMiddleware } from '@/middlewares/tokenHandler';
import { Route } from '@/types/express';
import { Router } from 'express';

export class PromotionRouter implements Route {
  readonly router: Router;
  readonly path: string;
  private readonly promotionController: PromotionController;
  private guard: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.promotionController = new PromotionController();
    this.guard = new AuthMiddleware();
    this.path = '/promotions';
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}/featured`,
      this.promotionController.getFeaturedPromotions,
    );
    this.router.post(
      `${this.path}/general`,
      uploader('PROMOTION', '/promotion').single('file'),
      validateGeneralPromotionCreation,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin']),
      this.promotionController.createGeneralPromotion,
    );
    this.router.post(
      `${this.path}/store`,
      validateStorePromotionCreation,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin', 'store admin']),
      this.promotionController.createStorePromotion,
    );
  }
}
