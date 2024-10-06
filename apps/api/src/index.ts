import App from './app';
import { OrderRoute } from './routers/orderRoute';
import { VerifyStoreRoute } from './routers/verifyRoute';
import { PaymentRoute } from './routers/paymentRoute';
import { AuthRouter } from './routers/authRouter';
import { UserRouter } from './routers/userRouter';
import { ShippingRouter } from './routers/shippingRouter';
import { GetOrderRouter } from './routers/getOrderRouter';
import { StoreRouter } from './routers/storeRouter';
import { PromotionRouter } from './routers/promotionRouter';
import { CourierRouter } from './routers/courierRouter';
import { SubcategoryRouter } from './routers/subcategoryRouter';
import { CategoryRouter } from './routers/categoryRouter';
import { BrandRouter } from './routers/brandRouter';
import { ProductRouter } from './routers/productRouter';
import { AdminRouter } from './routers/adminRouter';
import { InventoryRouter } from './routers/inventoryRouter';
import { StoreManagementRouter } from './routers/storeManagementRouter';
import { VoucherRouter } from './routers/voucherRouter';
import { SalesRouter } from './routers/salesRouter';

function main() {
  // Initialize the app with all the routes
  const app = new App([
    new SubcategoryRouter(),
    new CategoryRouter(),
    new BrandRouter(),
    new OrderRoute(),
    new AuthRouter(),
    new OrderRoute(),
    new GetOrderRouter(),
    new VerifyStoreRoute(),
    new PaymentRoute(),
    new UserRouter(),
    new ShippingRouter(),
    new StoreRouter(),
    new PromotionRouter(),
    new CategoryRouter(),
    new CourierRouter(),
    new ProductRouter(),
    new AdminRouter(),
    new InventoryRouter(),
    new StoreManagementRouter(),
    new VoucherRouter(),
    new SalesRouter(),
  ]);
  app.start();
  app.initializeCrons();
}

main();
