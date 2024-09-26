import { Router } from 'express';
import { ShippingController } from '@/controllers/shippingController';
import { Route } from '@/types/express';
import { AuthMiddleware } from '@/middlewares/tokenHandler';


export class ShippingRouter implements Route {
  readonly router: Router;
  readonly path: string;
  private readonly shippingController: ShippingController;
  private readonly guard: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.path = '/shipping';
    this.shippingController = new ShippingController();
    this.guard = new AuthMiddleware();
    this.initializeRoutes();
  }

  private initializeRoutes() {

    this.router.post(`${this.path}/confirm`, 
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['user']), 
      this.shippingController.confirmShipping);

    this.router.post(`${this.path}/process-order`,
      this.guard.verifyAccessToken, 
      this.guard.verifyRole(['store admin', 'super admin']),
      this.shippingController.processingOrder);

    this.router.post(`${this.path}/shipping-order`, 
      this.guard.verifyAccessToken, 
      this.guard.verifyRole(['store admin', 'super admin']),
      this.shippingController.shippingOrder);
    
    
    
  }
}