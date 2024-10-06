import type { User } from '@/types/express';
import { $Enums } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';
import updatePromotionAction from '@/actions/updatePromotionAction';
import updateStatePromotionAction from '@/actions/updateStatePromotionAction';
import inventoryQuery from '@/queries/inventoryQuery';

export default class UpdatePromotionController {
  public async updateNonProductPromotionState(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id, role } = req.user as User;
      const promotionId = parseInt(req.params.promotionId);
      const { state } = req.body;
      const updatedStatePromotion =
        await updateStatePromotionAction.updateNonProductPromotionStateAction(
          id,
          role,
          promotionId,
          state,
        );

      res.status(200).json({
        message: 'Ubah status promosi berhasil',
        data: updatedStatePromotion,
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateFreeProductPromotionState(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id, role } = req.user as User;
      const promotionId = parseInt(req.params.promotionId);
      const { state } = req.body;
      const updatedStatePromotion =
        await updateStatePromotionAction.updateFreeProductPromotionStateAction(
          id,
          role,
          promotionId,
          state,
        );

      res.status(200).json({
        message: 'Ubah status promosi berhasil',
        data: updatedStatePromotion,
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateDiscountProductPromotionState(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id, role } = req.user as User;
      const promotionId = parseInt(req.params.promotionId);
      const { state } = req.body;
      const updatedStatePromotion =
        await updateStatePromotionAction.updateDiscountProductPromotionStateAction(
          id,
          role,
          promotionId,
          state,
        );

      res.status(200).json({
        message: 'Ubah status promosi berhasil',
        data: updatedStatePromotion,
      });
    } catch (error) {
      next(error);
    }
  }

  public async editGeneralPromotion(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.user as User;
      const promotionId = parseInt(req.params.promotionId);
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
        await updatePromotionAction.updateGeneralPromotionAction({
          id: promotionId,
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
        message: 'Promosi general berhasil diubah',
        data: generalPromotion,
      });
    } catch (error) {
      next(error);
    }
  }

  public async editStorePromotion(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id, role } = req.user as User;
      const promotionId = parseInt(req.params.promotionId);
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
        await updatePromotionAction.updateStorePromotionAction({
          id: promotionId,
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
        message: 'Promosi toko berhasil diperbarui',
        data: storePromotion,
      });
    } catch (error) {
      next(error);
    }
  }

  public async editFreeProductPromotion(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id, role } = req.user as User;
      const promotionId = parseInt(req.params.promotionId);
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
        await updatePromotionAction.editFreeProductPromotionAction({
          id: promotionId,
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
        message: 'Promosi beli N gratis N pada toko berhasil diedit',
        data: freeProductPromotion,
      });
    } catch (err) {
      next(err);
    }
  }

  public async editDiscountProductPromotion(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id, role } = req.user as User;
      const promotionId = parseInt(req.params.promotionId);
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
        await updatePromotionAction.editDiscountProductPromotionAction({
          id: promotionId,
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
        message: 'Promosi diskon produk toko berhasil diperbarui',
        data: discountProductPromotion,
      });
    } catch (err) {
      next(err);
    }
  }
}
