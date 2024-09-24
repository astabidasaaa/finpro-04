import { Router } from 'express';
import { GetOrderController } from '@/controllers/getOrderController';
import { AuthMiddleware } from '@/middlewares/tokenHandler';
import { Route } from '@/types/express';


export class GetOrderRouter implements Route {
  readonly router: Router;
  readonly path: string;
  private readonly getOrderController: GetOrderController;
  private readonly guard: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.path = '/get-order';
    this.getOrderController = new GetOrderController();
    this.guard = new AuthMiddleware();
    this.initializeRoutes();
  }

  private initializeRoutes() {

    this.router.get(`${this.path}/get-all-order`, 
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin']), 
      this.getOrderController.getAllOrders);

    this.router.get(`${this.path}/get-finished-orders-by-user`, 
      this.guard.verifyAccessToken,
      this.getOrderController.getFinishedOrdersByUserId);

    this.router.get(`${this.path}/get-unfinished-orders-by-user`, 
      this.guard.verifyAccessToken,
      this.getOrderController.getUnfinishedOrdersByUserId);

    this.router.get(`${this.path}/get-orders-by-user`, 
      this.guard.verifyAccessToken,
      this.getOrderController.getOrdersByUserId);

    this.router.get(`${this.path}/get-order-by-id`, 
      this.guard.verifyAccessToken,
      this.getOrderController.getOrderById);
      
    this.router.get(`${this.path}/get-orders-by-store`, 
      this.guard.verifyAccessToken, 
      this.guard.verifyRole(['store admin', 'super admin']),
      this.getOrderController.getOrdersByStoreId);
    
    this.router.get(`${this.path}/get-all-stores`, 
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin']),
      this.getOrderController.getAllStores);
  }
}
