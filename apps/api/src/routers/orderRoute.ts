import { Router } from 'express';
import { OrderController } from '@/controllers/orderController';
import type { RouteItems } from '@/interfaces/routesInterface';

export class OrderRoute implements RouteItems {
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
  }
}
