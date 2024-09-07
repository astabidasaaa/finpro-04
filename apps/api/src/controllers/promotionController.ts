import featuredPromotionAction from '@/actions/featuredPromotionAction';
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
}
