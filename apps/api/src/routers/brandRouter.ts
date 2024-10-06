import { Router } from 'express';
import type { Route } from '@/types/express';
import { BrandController } from '@/controllers/brandController';
import { AuthMiddleware } from '@/middlewares/tokenHandler';

export class BrandRouter implements Route {
  readonly router: Router;
  readonly path: string;
  private readonly brandController: BrandController;
  private readonly guard: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.brandController = new BrandController();
    this.guard = new AuthMiddleware();
    this.path = '/brands';
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(`${this.path}/`, this.brandController.getAllBrand);
    this.router.get(
      `${this.path}/detail`,
      this.brandController.getAllBrandDetail,
    );
    this.router.get(
      `${this.path}/:brandId`,
      this.brandController.getSingleBrand,
    );
    this.router.post(
      `${this.path}`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin']),
      this.brandController.createBrand,
    );
    this.router.patch(
      `${this.path}/:brandId`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin']),
      this.brandController.updateBrand,
    );
    this.router.delete(
      `${this.path}/:brandId`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin']),
      this.brandController.deleteBrand,
    );
  }
}
