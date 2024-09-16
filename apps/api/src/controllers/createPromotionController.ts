import createPromotionAction from '@/actions/createPromotionAction';
import inventoryQuery from '@/queries/inventoryQuery';
import { User } from '@/types/express';
import { $Enums } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

export class CreatePromotionController {
  public async createGeneralPromotion(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.user as User;
      const { file } = req;
      const {
        name,
        promotionState,
        source,
        description,
        startedAt,
        finishedAt,
        quota,
        promotionType,
        discountType,
        discountValue,
        discountDurationSecs,
        isFeatured,
      } = req.body;

      const minPurchase = isNaN(req.body.minPurchase)
        ? undefined
        : parseInt(req.body.minPurchase);
      const maxDeduction = isNaN(req.body.maxDeduction)
        ? undefined
        : parseInt(req.body.maxDeduction);
      const afterMinPurchase = isNaN(req.body.afterMinPurchase)
        ? undefined
        : parseInt(req.body.afterMinPurchase);
      const afterMinTransaction = isNaN(req.body.afterMinTransaction)
        ? undefined
        : parseInt(req.body.afterMinTransaction);

      const generalPromotion =
        await createPromotionAction.createGeneralPromotionAction({
          creatorId: id,
          banner: file?.filename,
          scope: $Enums.PromotionScope.GENERAL,
          name,
          promotionState,
          source,
          description,
          startedAt,
          finishedAt,
          quota: parseInt(quota),
          promotionType,
          discountType,
          discountValue: parseFloat(discountValue),
          discountDurationSecs: parseInt(discountDurationSecs),
          isFeatured: Boolean(isFeatured),
          minPurchase,
          maxDeduction,
          afterMinPurchase,
          afterMinTransaction,
        });

      res.status(200).json({
        message: 'Promosi general berhasil dibuat',
        data: generalPromotion,
      });
    } catch (error) {
      next(error);
    }
  }

  public async createStorePromotion(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id, role } = req.user as User;
      const {
        name,
        promotionState,
        storeId,
        description,
        startedAt,
        finishedAt,
        quota,
        promotionType,
        discountType,
        discountValue,
        discountDurationSecs,
      } = req.body;

      const minPurchase = isNaN(req.body.minPurchase)
        ? undefined
        : parseInt(req.body.minPurchase);
      const maxDeduction = isNaN(req.body.maxDeduction)
        ? undefined
        : parseInt(req.body.maxDeduction);

      const storePromotion =
        await createPromotionAction.createStorePromotionAction({
          creatorId: id,
          role,
          scope: $Enums.PromotionScope.STORE,
          source: $Enums.PromotionSource.PER_BRANCH,
          storeId: parseInt(storeId),
          name,
          promotionState,
          description,
          startedAt,
          finishedAt,
          quota: parseInt(quota),
          promotionType,
          discountType,
          discountValue: parseFloat(discountValue),
          discountDurationSecs: parseInt(discountDurationSecs),
          isFeatured: false,
          minPurchase,
          maxDeduction,
        });

      res.status(200).json({
        message: 'Promosi toko berhasil dibuat',
        data: storePromotion,
      });
    } catch (error) {
      next(error);
    }
  }

  public async createFreeProductPromotion(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id, role } = req.user as User;
      const {
        promotionState,
        startedAt,
        finishedAt,
        storeId,
        productId,
        buy,
        get,
      } = req.body;

      const inventory = await inventoryQuery.getInventoryBuyProductIdAndStoreId(
        parseInt(productId),
        parseInt(storeId),
      );

      const freeProductPromotion =
        await createPromotionAction.createFreeProductPromotionAction({
          freeProductState: promotionState,
          startedAt,
          finishedAt,
          inventoryId: inventory.id,
          buy,
          get,
          creatorId: id,
          role,
          storeId,
        });

      res.status(200).json({
        message: 'Promosi beli N gratis N pada toko berhasil dibuat',
        data: freeProductPromotion,
      });
    } catch (err) {
      next(err);
    }
  }

  public async createDiscountProductPromotion(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id, role } = req.user as User;
      const {
        promotionState,
        startedAt,
        finishedAt,
        storeId,
        productId,
        discountValue,
        discountType,
      } = req.body;

      const inventory = await inventoryQuery.getInventoryBuyProductIdAndStoreId(
        parseInt(productId),
        parseInt(storeId),
      );

      const discountProductPromotion =
        await createPromotionAction.createDiscountProductPromotionAction({
          productDiscountState: promotionState,
          startedAt,
          finishedAt,
          inventoryId: inventory.id,
          discountValue: parseInt(discountValue),
          discountType,
          creatorId: id,
          role,
          storeId,
        });

      res.status(200).json({
        message: 'Promosi diskon produk toko berhasil dibuat',
        data: discountProductPromotion,
      });
    } catch (err) {
      next(err);
    }
  }
}
