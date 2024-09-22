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
      // Extract page, limit, and search from query
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string || undefined;
  
      const orders = await getOrderActions.getAllOrdersAction(page, limit, search);
  
      res.status(200).json({
        message: 'All orders retrieved successfully',
        data: orders.data,
        totalOrders: orders.total,
        totalPages: orders.totalPages,
        currentPage: page,
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
      const { customerId, from, to, search, page, pageSize } = req.query;
  
      const ordersData = await getOrderActions.getOrdersAction({
        customerId: customerId as string,
        from: from ? (from as string) : undefined,
        to: to ? (to as string) : undefined,
        search: search ? (search as string) : undefined,
        page: page ? (page as string) : undefined,
        pageSize: pageSize ? (pageSize as string) : undefined,
      });
  
      res.status(200).json({
        message: 'Orders retrieved successfully',
        data: ordersData.orders,
        pagination: {
          totalPages: ordersData.totalPages, // Ensure this value is correctly calculated
          ...ordersData.pagination, // Other pagination fields
        },
      });
    } catch (err) {
      if (err instanceof Error) {
        next(new HttpException(500, 'Failed to retrieve orders', err.message));
      } else {
        next(new HttpException(500, 'Failed to retrieve orders', 'An unknown error occurred'));
      }
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
          const from = req.query.from as string | undefined;
          const to = req.query.to as string | undefined;
          const search = req.query.search as string | undefined;
          const page = req.query.page as string | undefined;
          const pageSize = req.query.pageSize as string | undefined;
      
          const orders = await getOrderActions.getFinishedOrdersAction({
            customerIdStr,
            from,
            to,
            search,
            page,
            pageSize,
          });
      
          res.status(200).json({
            message: 'Finished orders retrieved successfully',
            data: orders,
            pagination: {
              totalPages: orders.totalPages, // Ensure this value is correctly calculated
              ...orders.pagination, // Other pagination fields
            },
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
          const from = req.query.from as string | undefined;
          const to = req.query.to as string | undefined;
          const search = req.query.search as string | undefined;
          const page = req.query.page as string | undefined;
          const pageSize = req.query.pageSize as string | undefined;
      
          const orders = await getOrderActions.getUnfinishedOrdersAction({
            customerIdStr,
            from,
            to,
            search,
            page,
            pageSize,
          });
      
          res.status(200).json({
            message: 'Finished orders retrieved successfully',
            data: orders,
            pagination: {
              totalPages: orders.totalPages, // Ensure this value is correctly calculated
              ...orders.pagination, // Other pagination fields
            },
          });
        } catch (err) {
          next(err);
        }
      }
      
      public async getOrdersByStoreId(
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> {
        try {
          const storeIdStr = req.query.storeId as string;
          const pageStr = req.query.page as string; // Get the page from query
          const limitStr = req.query.limit as string; // Get the limit from query
          const search = req.query.search as string; // Get the search term from query
      
          const { orders, totalOrders } = await getOrderActions.getOrdersByStoreAction(storeIdStr, pageStr, limitStr, search);
      
          res.status(200).json({
            message: 'Orders retrieved successfully',
            data: {
              orders,
              totalOrders,
              currentPage: parseInt(pageStr, 10) || 1,
              totalPages: Math.ceil(totalOrders / (parseInt(limitStr, 10) || 10)),
            },
          });
        } catch (err) {
          next(err);
        }
      }
      
      public async getAllStores(
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> {
        try {
          const stores = await getOrderActions.getAllStoresAction();
      
          res.status(200).json({
            message: 'Stores retrieved successfully',
            data: stores,
          });
        } catch (err) {
          next(err);
        }
      }
      
      
}