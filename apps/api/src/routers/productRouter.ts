import { Router } from 'express';
import type { Route } from '@/types/express';
import { AuthMiddleware } from '@/middlewares/tokenHandler';
import { ProductController } from '@/controllers/productController';
import { uploader } from '@/libs/uploader';

export class ProductRouter implements Route {
  readonly router: Router;
  readonly path: string;
  private readonly productController: ProductController;
  private guard: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.productController = new ProductController();
    this.path = '/products';
    this.guard = new AuthMiddleware();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // get all products with filter, sort, and pagination for /search
    this.router.get(`${this.path}`, this.productController.getProducts);
    this.router.get(
      `${this.path}/single/:productId`,
      this.productController.getProduct,
    );
    // get all products for dashboard product list
    this.router.get(`${this.path}/list`, this.productController.getProductList);
    // get all products in brief (name and id only)
    this.router.get(
      `${this.path}/all-brief`,
      this.productController.getAllProductBrief,
    );
    // get single product detail for specific store
    this.router.get(
      `${this.path}/single-store`,
      this.productController.getSingleProductDetail,
    );
    // make product and auto assign it to inventory of all store
    this.router.post(
      `${this.path}`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin']),
      uploader('PRODUCT', '/product').array('product', 8),
      this.productController.createProduct,
    );
    // update product detail and state, price = new ProductPriceHistory (previous price became inactive), image min 1
    this.router.patch(
      `${this.path}/:productId`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin']),
      uploader('PRODUCT', '/product').array('product', 8),
      this.productController.updateProduct,
    );
    // archive product
    this.router.patch(
      `${this.path}/archive/:productId`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin']),
      this.productController.archiveProduct,
    );
  }
}
