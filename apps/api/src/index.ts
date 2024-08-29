import App from './app';

import { OrderRoute } from './routers/orderRoute';
import { VerifyStoreRoute } from './routers/verifyRoute';
import { PaymentRoute } from './routers/paymentRoute';


function main() {
  // Initialize the app with all the routes
  const app = new App([
   
    new OrderRoute(),  // Add the OrderRoute
    new VerifyStoreRoute(),
    new PaymentRoute()
  ]);

  // Start the app
  app.start();
}

main();
