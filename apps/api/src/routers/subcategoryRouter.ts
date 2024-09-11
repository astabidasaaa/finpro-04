import { SubcategoryController } from '@/controllers/subcategoryController';
import { Route } from '@/types/express';
import { Router } from 'express';

export class SubcategoryRouter implements Route {
  readonly router: Router;
  readonly path: string;
  private readonly subcategoryController: SubcategoryController;

  constructor() {
    this.router = Router();
    this.subcategoryController = new SubcategoryController();
    this.path = '/subcategories';
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}/`,
      this.subcategoryController.getAllSubcategory,
    );
    this.router.post(
      `${this.path}`,
      // authenticateToken,
      // authorizeRole = superadmin,
      this.subcategoryController.createSubcategory,
    );
    this.router.patch(
      `${this.path}/:subcategoryId`,
      // authenticateToken,
      // authorizeRole = superadmin,
      this.subcategoryController.updateSubcategory,
    );
    this.router.delete(
      `${this.path}/:subcategoryId`,
      // authenticateToken
      // authorizeRole = superadmin
      this.subcategoryController.deleteSubcategory,
    );
  }
}
