import { CategoryController } from '@/controllers/categoryController';
import { AuthMiddleware } from '@/middlewares/tokenHandler';
import type { Route } from '@/types/express';
import { Router } from 'express';

export class CategoryRouter implements Route {
  readonly router: Router;
  readonly path: string;
  private readonly categoryController: CategoryController;
  private readonly guard: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.categoryController = new CategoryController();
    this.guard = new AuthMiddleware();
    this.path = '/categories';
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(`${this.path}/`, this.categoryController.getAllCategory);
    this.router.get(
      `${this.path}/:categoryId`,
      this.categoryController.getSingleCategory,
    );
    this.router.post(
      `${this.path}`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin']),
      this.categoryController.createCategoryAndSubcategories,
    );
    this.router.patch(
      `${this.path}/:categoryId`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin']),
      this.categoryController.updateCategory,
    );
    this.router.delete(
      `${this.path}/:categoryId`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin']),
      this.categoryController.deleteCategory,
    );
  }
}
