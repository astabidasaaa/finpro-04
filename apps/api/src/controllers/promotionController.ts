import featuredPromotionAction from '@/actions/featuredPromotionAction';
import promotionAction from '@/actions/promotionAction';
import { User } from '@/types/express';
import { $Enums } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

export class PromotionController {
  public async getFeaturedPromotions(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const featuredPromotions =
        await featuredPromotionAction.getFeaturedPromotion();

      res.status(200).json({
        message: 'Mengambil promosi unggulan berhasil',
        data: { featuredPromotions },
      });
    } catch (error) {
      next(error);
    }
  }

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
        await promotionAction.createGeneralPromotionAction({
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

      const generalPromotion = await promotionAction.createStorePromotionAction(
        {
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
        },
      );

      res.status(200).json({
        message: 'Promosi toko berhasil dibuat',
        data: generalPromotion,
      });
    } catch (error) {
      next(error);
    }
  }
}
