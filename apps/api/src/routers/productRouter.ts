import { ProductController } from '@/controllers/productController';
import { uploader } from '@/libs/uploader';
import { AuthMiddleware } from '@/middlewares/tokenHandler';
import { Route } from '@/types/express';
import { Router } from 'express';

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
    // get all products with including filter and pagination
    this.router.get(`${this.path}`, this.productController.getProducts);
    // get single product detail
    this.router.get(
      `${this.path}/single`,
      this.productController.getSingleProductDetail,
    );
    // make product and auto assign it to inventory of all store
    this.router.post(
      `${this.path}`,
      this.guard.verifyAccessToken,
      // authorizeRole = superadmin
      uploader('PRODUCT', '/product').array('product', 8),
      this.productController.createProduct,
    );
    // update product detail and state, price = new ProductPriceHistory (previous price became inactive), image min 1,
    this.router.patch(
      // authorizeToken
      // authorizeRole = superadmin
      `${this.path}/:productId`,
      this.productController.updateProduct,
    );
    // archive product
    this.router.patch(
      // authorizeToken
      // authorizeRole = superadmin
      `${this.path}/archive/:productId`,
      this.productController.archiveProduct,
    );
  }
}
