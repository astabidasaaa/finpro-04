import App from './app';
import { SubcategoryRouter } from './routers/subcategoryRouter';
import { CategoryRouter } from './routers/categoryRouter';
import { BrandRouter } from './routers/brandRouter';

const main = () => {
  const app = new App([
    new SubcategoryRouter(),
    new CategoryRouter(),
    new BrandRouter(),
  ]);
  app.start();
};

main();
