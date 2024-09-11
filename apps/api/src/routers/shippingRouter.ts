import { ShippingController } from '@/controllers/shippingController';
import { AuthMiddleware } from '@/middlewares/tokenHandler';
import { Route } from '@/types/express';
import { Router } from 'express';

export class ShippingRouter implements Route {
  readonly router: Router;
  readonly path: string;
  private readonly shippingController: ShippingController;
  private guard: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.shippingController = new ShippingController();
    this.guard = new AuthMiddleware();
    this.path = '/shipping';
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      `${this.path}/`,
      this.guard.verifyAccessToken,
      this.shippingController.getShippingPrice,
    );
  }
}
