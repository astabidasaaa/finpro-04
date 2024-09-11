import { Request, Response, NextFunction } from 'express';
import prisma from '@/prisma'; 
import { OrderStatus } from '@prisma/client';
import { OrderStatusService } from '@/utils/orderStatusService';
import { HttpException } from '@/errors/httpException';
import shippingAction from '@/actions/shippingAction';


export class ShippingController {
    public async confirmShipping(
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> {
        try {
          const { orderId, userId } = req.body;
          const orderIdInt = parseInt(orderId, 10);
      
          if (isNaN(orderIdInt)) {
            throw new HttpException(400, 'Invalid orderId format');
          }
      
          const result = await prisma.$transaction(async (prisma) => {
            const order = await prisma.order.findUnique({
              where: { id: orderIdInt },
            });
      
            if (!order) {
              throw new HttpException(404, 'Order not found');
            }
      
            // Update the order status to DIKONFIRMASI
            const orderStatusResult = await OrderStatusService.updateOrderStatus(
              orderIdInt,
              OrderStatus.DIKONFIRMASI,
              userId,
              'Order status updated to DIKONFIRMASI'
            );
      
            return orderStatusResult;
          });
      
          res.status(200).json({
            message: 'Order shipping confirmed successfully',
            data: result,
          });
        } catch (err) {
          if (err instanceof Error) {
            next(new HttpException(500, 'Failed to confirm order shipping', err.message));
          } else {
            next(new HttpException(500, 'Failed to confirm order shipping', 'An unknown error occurred'));
          }
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