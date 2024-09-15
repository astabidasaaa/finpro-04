import featuredPromotionAction from '@/actions/featuredPromotionAction';
import promotionAction from '@/actions/promotionAction';
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
        minPurchase,
        maxDeduction,
        afterMinPurchase,
        afterMinTransaction,
      } = req.body;

      const referralPromotion =
        await promotionAction.createGeneralPromotionAction();

      res.status(200).json({
        message: 'Mengambil promosi unggulan berhasil',
        data: referralPromotion,
      });
    } catch (error) {
      next(error);
    }
  }
}
