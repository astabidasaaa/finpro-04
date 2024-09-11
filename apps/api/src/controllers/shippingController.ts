import featuredPromotionAction from '@/actions/featuredPromotionAction';
import shippingAction from '@/actions/shippingAction';
import { NextFunction, Request, Response } from 'express';

export class ShippingController {
  public async getShippingPrice(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const {
        origin_latitude,
        origin_longitude,
        destination_latitude,
        destination_longitude,
        itemList,
      } = req.body;

      const shippingPriceList = await shippingAction.calculateShippingPrice({
        origin_latitude,
        origin_longitude,
        destination_latitude,
        destination_longitude,
        itemList,
      });

      res.status(200).json({
        message: 'Mengambil kalkulasi ongkos pengiriman berhasil',
        data: { shippingPriceList },
      });
    } catch (error) {
      next(error);
    }
  }
}
