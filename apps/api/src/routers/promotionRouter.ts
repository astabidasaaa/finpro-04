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
import { Route } from '@/types/express';
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
    this.router.get(
      `${this.path}/general`,
      this.getPromotionController.getGeneralPromotions, // query params promotionState
    );
    this.router.get(
      `${this.path}/store`,
      this.getPromotionController.getStorePromotions, // query params promotionState & storeId
    );
    this.router.get(
      `${this.path}/freeproduct`,
      this.getPromotionController.getFreeProductPromotions, // query params promotionState & storeId
    );
    this.router.get(
      `${this.path}/discountproduct`,
      this.getPromotionController.getDiscountProductPromotions, // query params promotionState & storeId
    );
    this.router.post(
      `${this.path}/general`,
      validateGeneralPromotionCreation,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin']),
      uploader('PROMOTION', '/promotion').single('file'),
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
      `${this.path}/freeproduct`, // body storeId and productId ++
      validateFreeProductPromotionCreation,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin', 'store admin']),
      this.createPromotionController.createFreeProductPromotion,
    );
    this.router.post(
      `${this.path}/discountproduct`, // body storeId and productId ++
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
      `${this.path}/freeproduct/:promotionId`, // body storeId and productId ++
      validateFreeProductPromotionCreation,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin', 'store admin']),
      this.updatePromotionController.editFreeProductPromotion,
    );
    this.router.patch(
      `${this.path}/discountproduct/:promotionId`, // body storeId and productId ++
      validateDiscountProductPromotionCreation,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin', 'store admin']),
      this.updatePromotionController.editDiscountProductPromotion,
    );
    this.router.patch(
      `${this.path}/archive/nonproduct/:promotionId`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin', 'store admin']),
      this.updatePromotionController.archiveNonProductPromotion,
    );
    this.router.patch(
      `${this.path}/archive/freeproduct/:promotionId`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin', 'store admin']),
      this.updatePromotionController.archiveFreeProductPromotion,
    );
    this.router.patch(
      `${this.path}/archive/discountproduct/:promotionId`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin', 'store admin']),
      this.updatePromotionController.archiveDiscountProductPromotion,
    );
  }
}
