import { Router } from 'express';
import { OrderController } from '@/controllers/orderController';
import { Route } from '@/types/express';
import { AuthMiddleware } from '@/middlewares/tokenHandler';


export class OrderRoute implements Route {
  readonly router: Router;
  readonly path: string;
  private readonly orderController: OrderController;
  private readonly guard: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.path = '/orders';
    this.orderController = new OrderController();
    this.guard = new AuthMiddleware();
    this.initializeRoutes();
  }

  private initializeRoutes() {

    this.router.post(this.path, 
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin']),
      this.orderController.createOrder);

    this.router.post(`${this.path}/cancel`, 
      this.guard.verifyAccessToken,
      this.orderController.cancelOrder);

    this.router.post(`${this.path}/find-nearest-store`, 
      this.guard.verifyAccessToken,
      this.orderController.findNearestStore);

    this.router.post(`${this.path}/check-inventory`, 
      this.guard.verifyAccessToken,
      this.orderController.checkInventory);
    this.router.get(`${this.path}/get-user-by-id`, 
      this.guard.verifyAccessToken,
      this.orderController.getUserById);
    
    
  }
}
