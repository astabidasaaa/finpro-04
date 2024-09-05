import { CategoryController } from '@/controllers/categoryController';
import { AuthMiddleware } from '@/middlewares/tokenHandler';
import { Route } from '@/types/express';
import { Router } from 'express';

export class CategoryRouter implements Route {
  readonly router: Router;
  readonly path: string;
  private readonly categoryController: CategoryController;
  private guard: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.categoryController = new CategoryController();
    this.guard = new AuthMiddleware();
    this.path = '/categories';
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}/`,
      this.categoryController.getAllCategoriesAndSubCategories,
    );
  }
}
