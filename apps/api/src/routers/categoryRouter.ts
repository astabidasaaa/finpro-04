import { CategoryController } from '@/controllers/categoryController';
import { Route } from '@/types/express';
import { Router } from 'express';

export class CategoryRouter implements Route {
  readonly router: Router;
  readonly path: string;
  private readonly categoryController: CategoryController;

  constructor() {
    this.router = Router();
    this.categoryController = new CategoryController();
    this.path = '/categories';
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(`${this.path}/all`, this.categoryController.getAllCategory);
    this.router.get(
      `${this.path}/`,
      this.categoryController.getAllCategoriesAndSubCategories,
    );
    this.router.get(
      `${this.path}/:categoryId`,
      this.categoryController.getSingleCategory,
    );
    this.router.post(
      `${this.path}`,
      // authenticateToken,
      // authorizeRole = superadmin,
      this.categoryController.createCategoryAndSubcategories,
    );
    this.router.patch(
      `${this.path}/:categoryId`,
      // authenticateToken,
      // authorizeRole = superadmin,
      this.categoryController.updateCategory,
    );
    this.router.delete(
      `${this.path}/:categoryId`,
      // authenticateToken
      // authorizeRole = superadmin
      this.categoryController.deleteCategory,
    );
  }
}
