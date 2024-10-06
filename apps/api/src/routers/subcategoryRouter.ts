import { Router } from 'express';
import type { Route } from '@/types/express';
import { SubcategoryController } from '@/controllers/subcategoryController';
import { AuthMiddleware } from '@/middlewares/tokenHandler';

export class SubcategoryRouter implements Route {
  readonly router: Router;
  readonly path: string;
  private readonly subcategoryController: SubcategoryController;
  private readonly guard: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.subcategoryController = new SubcategoryController();
    this.guard = new AuthMiddleware();
    this.path = '/subcategories';
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}/`,
      this.subcategoryController.getAllSubcategory,
    );
    this.router.get(
      `${this.path}/detail`,
      this.subcategoryController.getAllSubcategoryDetail,
    );
    this.router.post(
      `${this.path}`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin']),
      this.subcategoryController.createSubcategory,
    );
    this.router.patch(
      `${this.path}/:subcategoryId`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin']),
      this.subcategoryController.updateSubcategory,
    );
    this.router.delete(
      `${this.path}/:subcategoryId`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin']),
      this.subcategoryController.deleteSubcategory,
    );
  }
}
