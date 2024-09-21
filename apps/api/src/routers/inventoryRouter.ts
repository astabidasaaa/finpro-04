import { InventoryController } from '@/controllers/inventoryController';
import { InventoryReportController } from '@/controllers/inventoryReportController';
import { validateInventoryChangeCreation } from '@/middlewares/addInventoryChangeValidator';
import { AuthMiddleware } from '@/middlewares/tokenHandler';
import { Route } from '@/types/express';
import { Router } from 'express';

export class InventoryRouter implements Route {
  readonly router: Router;
  readonly path: string;
  private readonly inventoryController: InventoryController;
  private readonly inventoryReportController: InventoryReportController;
  private readonly guard: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.inventoryController = new InventoryController();
    this.inventoryReportController = new InventoryReportController();
    this.guard = new AuthMiddleware();
    this.path = '/inventories';
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}/all-store`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin']),
      this.inventoryController.getAllInventory,
    );
    this.router.get(
      `${this.path}/:storeId`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['store admin', 'super admin']),
      this.inventoryController.getStoreInventory,
    );
    this.router.get(
      `${this.path}/product/all-store`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin']),
      this.inventoryReportController.getAllStoreProductStockPerMonth,
    );
    this.router.get(
      `${this.path}/product/:storeId`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['store admin', 'super admin']),
      this.inventoryReportController.getStoreProductStockPerMonth,
    );
    this.router.get(
      `${this.path}/productdetail`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['store admin', 'super admin']),
      this.inventoryReportController.getProductInventoryChangePerMonth,
    );
    this.router.get(
      `${this.path}/update/all-store`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['store admin', 'super admin']),
      this.inventoryController.getAllInventoryUpdates,
    );
    this.router.get(
      `${this.path}/update/:storeId`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['store admin', 'super admin']),
      this.inventoryController.getStoreInventoryUpdates,
    );
    this.router.get(
      `${this.path}/update/:inventoryId`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['store admin', 'super admin']),
      this.inventoryController.getProductInventoryUpdates,
    );
    this.router.post(
      `${this.path}/update/`,
      validateInventoryChangeCreation,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin', 'store admin']),
      this.inventoryController.addInventoryChange,
    );
  }
}
