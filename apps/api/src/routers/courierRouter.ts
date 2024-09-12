import { CourierController } from '@/controllers/courierController';
import { AuthMiddleware } from '@/middlewares/tokenHandler';
import { Route } from '@/types/express';
import { Router } from 'express';

export class CourierRouter implements Route {
  readonly router: Router;
  readonly path: string;
  private readonly courierController: CourierController;
  private guard: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.courierController = new CourierController();
    this.guard = new AuthMiddleware();
    this.path = '/courier';
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      `${this.path}/`,
      this.guard.verifyAccessToken,
      this.courierController.getShippingPrice,
    );
  }
}
