import { Request, Response, NextFunction } from 'express';
import { findNearestStore } from '@/actions/verifyStoreActions';
import { HttpException } from '@/errors/httpException';

export class VerifyStoreController {
  public async checkClosestStore(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        deliveryLatitude,
        deliveryLongitude
      } = req.body;

      // Find all stores and their distances
      const storeDistances = await findNearestStore(deliveryLatitude, deliveryLongitude);

      res.status(200).json({
        message: 'Store distances calculated successfully',
        data: storeDistances
      });
    } catch (err) {
      if (err instanceof Error) {
        next(new HttpException(500, 'Failed to calculate store distances', err.message));
      } 
    }
  }
}
