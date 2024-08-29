import App from './app';
import { OrderRoute } from './routers/orderRoute';
import { VerifyStoreRoute } from './routers/verifyRoute';
import { PaymentRoute } from './routers/paymentRoute';
import { SubcategoryRouter } from './routers/subcategoryRouter';
import { CategoryRouter } from './routers/categoryRouter';
import { BrandRouter } from './routers/brandRouter';

const main = () => {
  const app = new App([
    new SubcategoryRouter(),
    new CategoryRouter(),
    new BrandRouter(),
    new OrderRoute(),
    new VerifyStoreRoute(),
    new PaymentRoute(),
  ]);
  app.start();
};

main();
