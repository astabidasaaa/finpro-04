import { SalesController } from '@/controllers/salesController';
import TopSalesController from '@/controllers/topSalesController';
import { AuthMiddleware } from '@/middlewares/tokenHandler';
import { Route } from '@/types/express';
import { Router } from 'express';

export class SalesRouter implements Route {
  readonly router: Router;
  readonly path: string;
  private readonly salesController: SalesController;
  private readonly topSalesController: TopSalesController;
  private readonly guard: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.salesController = new SalesController();
    this.topSalesController = new TopSalesController();
    this.guard = new AuthMiddleware();
    this.path = '/sales';
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}/overall/all-store`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin']),
      this.salesController.getAllStoreOverallPerMonth,
    );
    this.router.get(
      `${this.path}/overall/single/:storeId`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin', 'store admin']),
      this.salesController.getStoreOverallPerMonth,
    );
    this.router.get(
      `${this.path}/product/all-store`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin']),
      this.salesController.getAllStoreProductSalesPerMonth,
    );
    this.router.get(
      `${this.path}/product/single/:storeId`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin', 'store admin']),
      this.salesController.getStoreProductSalesPerMonth,
    );
    this.router.get(
      `${this.path}/category/all-store`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin']),
      this.salesController.getAllStoreCategorySalesPerMonth,
    );
    this.router.get(
      `${this.path}/category/single/:storeId`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin', 'store admin']),
      this.salesController.getStoreCategorySalesPerMonth,
    );
    this.router.get(
      `${this.path}/product/top/all-store`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin']),
      this.topSalesController.getAllStoreTopProductSalesPerMonth,
    );
    this.router.get(
      `${this.path}/product/top/single/:storeId`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin', 'store admin']),
      this.topSalesController.getStoreTopProductSalesPerMonth,
    );
    this.router.get(
      `${this.path}/category/top/all-store`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin']),
      this.topSalesController.getAllStoreTopCategorySalesPerMonth,
    );
    this.router.get(
      `${this.path}/category/top/single/:storeId`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin', 'store admin']),
      this.topSalesController.getStoreTopCategorySalesPerMonth,
    );
  }
}
