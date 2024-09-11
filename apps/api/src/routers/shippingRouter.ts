import { Router } from 'express';
import { ShippingController } from '@/controllers/shippingController';
import { Route } from '@/types/express';


export class ShippingRouter implements Route {
  readonly router: Router;
  readonly path: string;
  private readonly shippingController: ShippingController;

  constructor() {
    this.router = Router();
    this.path = '/shipping';
    this.shippingController = new ShippingController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Create a new order
    // this.router.post(this.path, this.orderController.createOrder);
    this.router.post(`${this.path}/confirm`, this.shippingController.confirmShipping);
    this.router.post(`${this.path}/process-order`, this.shippingController.processingOrder);
    this.router.post(`${this.path}/shipping-order`, this.shippingController.shippingOrder);
    
    
    
  }
}