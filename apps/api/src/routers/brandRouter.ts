import { BrandController } from '@/controllers/brandController';
import { Route } from '@/types/express';
import { Router } from 'express';

export class BrandRouter implements Route {
  readonly router: Router;
  readonly path: string;
  private readonly brandController: BrandController;

  constructor() {
    this.router = Router();
    this.brandController = new BrandController();
    this.path = '/brands';
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(`${this.path}/`, this.brandController.getAllBrand);
    this.router.get(
      `${this.path}/:brandId`,
      this.brandController.getSingleBrand,
    );
    this.router.post(
      `${this.path}`,
      // authenticateToken,
      // authorizeRole = superadmin,
      this.brandController.createBrand,
    );
    this.router.patch(
      `${this.path}/:brandId`,
      // authenticateToken,
      // authorizeRole = superadmin,
      this.brandController.updateBrand,
    );
    this.router.delete(
      `${this.path}/:brandId`,
      // authenticateToken
      // authorizeRole = superadmin
      this.brandController.deleteBrand,
    );
  }
}
