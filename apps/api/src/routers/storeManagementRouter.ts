import { StoreController } from '@/controllers/storeController';
import {
  validateStoreCreate,
  validateStoreUpdate,
} from '@/middlewares/storeValidator';
import { AuthMiddleware } from '@/middlewares/tokenHandler';
import { Route } from '@/types/express';
import { Router } from 'express';

export class StoreManagementRouter implements Route {
  readonly router: Router;
  readonly path: string;
  private readonly storeController: StoreController;
  private guard: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.storeController = new StoreController();
    this.guard = new AuthMiddleware();
    this.path = '/store-management';
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}/`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin']),
      this.storeController.getStoresWithQuery,
    );

    this.router.post(
      `${this.path}/create`,
      validateStoreCreate,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin']),
      this.storeController.createStore,
    );

    this.router.get(
      `${this.path}/:storeId`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin']),
      this.storeController.getSingleStore,
    );

    this.router.patch(
      `${this.path}/:storeId`,
      validateStoreUpdate,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin']),
      this.storeController.updateSingleStore,
    );

    this.router.delete(
      `${this.path}/:storeId`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin']),
      this.storeController.deleteStore,
    );
  }
}
