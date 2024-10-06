import { CreatePromotionController } from '@/controllers/createPromotionController';
import { GetPromotionController } from '@/controllers/getPromotionController';
import UpdatePromotionController from '@/controllers/updatePromotionController';
import { uploader } from '@/libs/uploader';
import { validateGeneralPromotionCreation } from '@/middlewares/generalPromotionValidator';
import {
  validateDiscountProductPromotionCreation,
  validateFreeProductPromotionCreation,
  validateStorePromotionCreation,
} from '@/middlewares/storePromotionValidator';
import { AuthMiddleware } from '@/middlewares/tokenHandler';
import type { Route } from '@/types/express';
import { Router } from 'express';

export class PromotionRouter implements Route {
  readonly router: Router;
  readonly path: string;
  private readonly createPromotionController: CreatePromotionController;
  private readonly getPromotionController: GetPromotionController;
  private readonly updatePromotionController: UpdatePromotionController;
  private readonly guard: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.createPromotionController = new CreatePromotionController();
    this.getPromotionController = new GetPromotionController();
    this.updatePromotionController = new UpdatePromotionController();
    this.guard = new AuthMiddleware();
    this.path = '/promotions';
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}/featured`,
      this.getPromotionController.getFeaturedPromotions,
    );
    // filter search
    this.router.get(
      `${this.path}/general`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin', 'store admin']),
      this.getPromotionController.getGeneralPromotions,
    );
    // filter search
    this.router.get(
      `${this.path}/store`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin', 'store admin']),
      this.getPromotionController.getStorePromotions,
    );
    // all active store voucher
    this.router.get(
      `${this.path}/activestore/:storeId`,
      this.guard.verifyAccessToken,
      this.getPromotionController.getActiveStorePromotions,
    );
    // filter search
    this.router.get(
      `${this.path}/freeproduct`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin', 'store admin']),
      this.getPromotionController.getFreeProductPromotions,
    );
    // filter search
    this.router.get(
      `${this.path}/discountproduct`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin', 'store admin']),
      this.getPromotionController.getDiscountProductPromotions,
    );
    this.router.post(
      `${this.path}/general`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin']),
      uploader('PROMOTION', '/promotion').single('file'),
      validateGeneralPromotionCreation,
      this.createPromotionController.createGeneralPromotion,
    );
    this.router.post(
      `${this.path}/store`,
      validateStorePromotionCreation,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin', 'store admin']),
      this.createPromotionController.createStorePromotion,
    );
    this.router.post(
      `${this.path}/freeproduct`,
      validateFreeProductPromotionCreation,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin', 'store admin']),
      this.createPromotionController.createFreeProductPromotion,
    );
    this.router.post(
      `${this.path}/discountproduct`,
      validateDiscountProductPromotionCreation,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin', 'store admin']),
      this.createPromotionController.createDiscountProductPromotion,
    );
    this.router.patch(
      `${this.path}/general/:promotionId`,
      validateGeneralPromotionCreation,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin']),
      uploader('PROMOTION', '/promotion').single('file'),
      this.updatePromotionController.editGeneralPromotion,
    );
    this.router.patch(
      `${this.path}/store/:promotionId`,
      validateStorePromotionCreation,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin', 'store admin']),
      this.updatePromotionController.editStorePromotion,
    );
    this.router.patch(
      `${this.path}/freeproduct/:promotionId`,
      validateFreeProductPromotionCreation,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin', 'store admin']),
      this.updatePromotionController.editFreeProductPromotion,
    );
    this.router.patch(
      `${this.path}/discountproduct/:promotionId`,
      validateDiscountProductPromotionCreation,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin', 'store admin']),
      this.updatePromotionController.editDiscountProductPromotion,
    );
    this.router.patch(
      `${this.path}/state/nonproduct/:promotionId`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin', 'store admin']),
      this.updatePromotionController.updateNonProductPromotionState,
    );
    this.router.patch(
      `${this.path}/state/freeproduct/:promotionId`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin', 'store admin']),
      this.updatePromotionController.updateFreeProductPromotionState,
    );
    this.router.patch(
      `${this.path}/state/discountproduct/:promotionId`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin', 'store admin']),
      this.updatePromotionController.updateDiscountProductPromotionState,
    );
  }
}
