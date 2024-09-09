import { DisplayStoreController } from '@/controllers/displayStoreController';
import { AuthMiddleware } from '@/middlewares/tokenHandler';
import { Route } from '@/types/express';
import { Router } from 'express';

export class StoreRouter implements Route {
  readonly router: Router;
  readonly path: string;
  private readonly displayStoreController: DisplayStoreController;
  private guard: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.displayStoreController = new DisplayStoreController();
    this.guard = new AuthMiddleware();
    this.path = '/stores';
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}/single/:storeId`,
      this.displayStoreController.getSingleStore,
    );
    this.router.post(
      `${this.path}/nearest-store`,
      this.displayStoreController.nearestStoreId,
    );

    this.router.get(
      `${this.path}/nearest-store/:storeId`,
      this.displayStoreController.nearestStore,
    );
  }
}
