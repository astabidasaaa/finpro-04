import { Request, Response, NextFunction } from 'express';
import prisma from '@/prisma'; 
import { OrderStatus } from '@prisma/client';
import { OrderStatusService } from '@/utils/orderStatusService';
import { HttpException } from '@/errors/httpException';
import shippingAction from '@/actions/shippingAction';


export class ShippingController {
  public async confirmShipping(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { orderId, userId } = req.body;
      const orderIdInt = parseInt(orderId, 10);

      if (isNaN(orderIdInt)) {
        throw new Error('Invalid orderId format');
      }

      // Call the action layer to perform the business logic
      const result = await shippingAction.confirmShippingAction(orderIdInt, userId);

      res.status(200).json({
        message: 'Order shipping confirmed successfully',
        data: result,
      });
    } catch (err) {
      next(err); // Handle errors with middleware
    }
  
      }
      public async processingOrder(
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> {
        try {
          const { orderId, userId } = req.body;
          const orderIdInt = parseInt(orderId, 10);
          const result = await shippingAction.processingOrderAction(orderIdInt, userId);
      
          res.status(200).json({
            message: 'Order processed successfully',
            data: result,
          });
        } catch (err) {
          next(err);
        }
      }
      public async shippingOrder(
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> {
        try {
          const { orderId, userId } = req.body;
          const orderIdInt = parseInt(orderId, 10);
          const result = await shippingAction.shippingOrderAction(orderIdInt, userId);
      
          res.status(200).json({
            message: 'Order shipped successfully',
            data: result,
          });
        } catch (err) {
          next(err);
        }
      }
      
}