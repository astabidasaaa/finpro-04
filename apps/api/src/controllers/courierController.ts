import courierAction from '@/actions/courierAction';
import featuredPromotionAction from '@/actions/featuredPromotionAction';
import { User } from '@/types/express';
import { NextFunction, Request, Response } from 'express';

export class CourierController {
  public async getShippingPrice(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.user as User;

      const { storeId, addressId, itemList } = req.body;

      const shippingPriceList = await courierAction.calculateShippingPrice({
        userId: id,
        storeId,
        addressId,
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
