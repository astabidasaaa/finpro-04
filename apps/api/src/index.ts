import App from './app';

import { OrderRoute } from './routers/orderRoute';
import { VerifyStoreRoute } from './routers/verifyRoute';
import { PaymentRoute } from './routers/paymentRoute';
import { AuthRouter } from './routers/authRouter';
import { UserRouter } from './routers/userRouter';
import { SubcategoryRouter } from './routers/subcategoryRouter';
import { CategoryRouter } from './routers/categoryRouter';
import { BrandRouter } from './routers/brandRouter';

function main() {
  // Initialize the app with all the routes
  const app = new App([
    new AuthRouter(),
    new OrderRoute(), // Add the OrderRoute
    new VerifyStoreRoute(),
    new PaymentRoute(),
    new UserRouter(),
    new SubcategoryRouter(),
    new CategoryRouter(),
    new BrandRouter(),
  ]);

  // Start the app
  app.start();
}

main();
