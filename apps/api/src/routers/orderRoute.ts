import { Router } from 'express';
import { OrderController } from '@/controllers/orderController';
import { Route } from '@/types/express';


export class OrderRoute implements Route {
  readonly router: Router;
  readonly path: string;
  private readonly orderController: OrderController;

  constructor() {
    this.router = Router();
    this.path = '/orders';
    this.orderController = new OrderController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Create a new order
    this.router.post(this.path, this.orderController.createOrder);
    this.router.post(`${this.path}/cancel`, this.orderController.cancelOrder);
    this.router.post(`${this.path}/find-nearest-store`, this.orderController.findNearestStore);
    this.router.post(`${this.path}/check-inventory`, this.orderController.checkInventory);
    this.router.get(`${this.path}/get-user-by-id`, this.orderController.getUserById);
    
    
  }
}
