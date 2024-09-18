import featuredPromotionAction from '@/actions/featuredPromotionAction';
import getPromotionAction from '@/actions/getPromotionAction';
import { User } from '@/types/express';
import { $Enums } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

export class GetPromotionController {
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

  public async getGeneralPromotions(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      let { page = 1, pageSize = 20, keyword = '', promotionState } = req.query;
      if (promotionState === undefined) {
        promotionState = undefined;
      } else {
        promotionState = String(promotionState);
      }
      const generalPromotions =
        await getPromotionAction.getGeneralPromotionsAction({
          promotionState,
          keyword: String(keyword),
          page: Number(page),
          pageSize: Number(pageSize),
        });

      res.status(200).json({
        message: 'Mengambil promosi general berhasil',
        data: generalPromotions,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getStorePromotions(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      let {
        page = 1,
        pageSize = 20,
        keyword = '',
        promotionState,
        storeId,
      } = req.query;
      if (promotionState === undefined) {
        promotionState = undefined;
      } else {
        promotionState = String(promotionState);
      }
      const storePromotions = await getPromotionAction.getStorePromotionsAction(
        {
          promotionState,
          storeId: Number(storeId),
          keyword: String(keyword),
          page: Number(page),
          pageSize: Number(pageSize),
        },
      );

      res.status(200).json({
        message: 'Mengambil promosi toko berhasil',
        data: storePromotions,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getFreeProductPromotions(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      let {
        page = 1,
        pageSize = 20,
        keyword = '',
        promotionState,
        storeId,
      } = req.query;
      if (promotionState === undefined) {
        promotionState = undefined;
      } else {
        promotionState = String(promotionState);
      }

      const freeProductPromotions =
        await getPromotionAction.getFreeProductPromotionsAction({
          promotionState,
          storeId: Number(storeId),
          keyword: String(keyword),
          page: Number(page),
          pageSize: Number(pageSize),
        });

      res.status(200).json({
        message: 'Mengambil promosi beli N gratis N berhasil',
        data: freeProductPromotions,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getDiscountProductPromotions(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      let {
        page = 1,
        pageSize = 20,
        keyword = '',
        promotionState,
        storeId,
      } = req.query;
      if (promotionState === undefined) {
        promotionState = undefined;
      } else {
        promotionState = String(promotionState);
      }

      const discountProductPromotions =
        await getPromotionAction.getDiscountProductPromotionsAction({
          promotionState,
          storeId: Number(storeId),
          keyword: String(keyword),
          page: Number(page),
          pageSize: Number(pageSize),
        });

      res.status(200).json({
        message: 'Mengambil promosi diskon produk berhasil',
        data: discountProductPromotions,
      });
    } catch (error) {
      next(error);
    }
  }
}
