import { DisplayStoreController } from '@/controllers/displayStoreController';
import { StoreController } from '@/controllers/storeController';
import { AuthMiddleware } from '@/middlewares/tokenHandler';
import { Route } from '@/types/express';
import { Router } from 'express';

export class StoreRouter implements Route {
  readonly router: Router;
  readonly path: string;
  private readonly displayStoreController: DisplayStoreController;
  private readonly storeController: StoreController;
  private guard: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.displayStoreController = new DisplayStoreController();
    this.storeController = new StoreController();
    this.guard = new AuthMiddleware();
    this.path = '/stores';
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(`${this.path}/`, this.displayStoreController.getAllStore);

    this.router.post(
      `${this.path}/nearest`,
      this.displayStoreController.nearestStoreId,
    );

    this.router.get(
      `${this.path}/nearest/:storeId`,
      this.displayStoreController.nearestStore,
    );

    this.router.get(
      `${this.path}/:storeId`,
      this.displayStoreController.getSingleStore,
    );

    this.router.get(
      `${this.path}/single/:adminId`,
      this.displayStoreController.getAdminStore,
    );
  }
}
