import { Request, Response, NextFunction } from 'express';
import { HttpException } from '@/errors/httpException';
import getOrderActions from '@/actions/getOrderActions';

export class GetOrderController {
    public async getAllOrders(
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> {
        try {
          const orders = await getOrderActions.getAllOrdersAction();
    
          res.status(200).json({
            message: 'All orders retrieved successfully',
            data: orders,
          });
        } catch (err) {
          next(err);
        }
      }
      public async getOrdersByUserId(
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> {
        try {
          const customerIdStr = req.query.customerId as string;
    
          const orders = await getOrderActions.getOrdersAction(customerIdStr);
    
          res.status(200).json({
            message: 'Orders retrieved successfully',
            data: orders,
          });
        } catch (err) {
          next(err);
        }
      }
      public async getOrderById(
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> {
        try {
          const orderIdStr = req.query.orderId as string;
          const order = await getOrderActions.getOrderByIdAction(orderIdStr);
    
          res.status(200).json({
            message: 'Order retrieved successfully',
            data: order,
          });
        } catch (err) {
          next(err);
        }
      }
      public async getFinishedOrdersByUserId(
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> {
        try {
          const customerIdStr = req.query.customerId as string;
    
          const orders = await getOrderActions.getFinishedOrdersAction(customerIdStr);
          
          res.status(200).json({
            message: 'Finished orders retrieved successfully',
            data: orders,
          });
        } catch (err) {
          next(err);
        }
      }
    
      
      
      public async getUnfinishedOrdersByUserId(
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> {
        try {
          const customerIdStr = req.query.customerId as string;
    
          const orders = await getOrderActions.getUnfinishedOrdersAction(customerIdStr);
          
          res.status(200).json({
            message: 'Unfinished orders retrieved successfully',
            data: orders,
          });
        } catch (err) {
          next(err);
        }
      }
      public async getOrdersByDateRangeAndUserId(
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> {
        try {
          const { customerId, from, to } = req.query;
    
          // Call the action to handle the business logic
          const orders = await getOrderActions.getOrdersByDateRangeAndUserId({
            customerId: customerId as string,
            from: from as string,
            to: to as string,
          });
    
          // Respond with the result
          res.status(200).json({
            message: 'Orders retrieved successfully',
            data: orders,
          });
        } catch (err) {
          if (err instanceof Error) {
            next(new HttpException(500, 'Failed to retrieve orders by user ID and date range', err.message));
          } else {
            next(new HttpException(500, 'Failed to retrieve orders by user ID and date range', 'An unknown error occurred'));
          }
        }
      }
}