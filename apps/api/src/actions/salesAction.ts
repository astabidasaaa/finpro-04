import salesQuery from '@/queries/salesQuery';
import {
  AllStoreCategoryPerMonth,
  AllStoreOverallPerMonth,
  AllStoreTopPerMonth,
  OverallProps,
  PerStoreCategoryPerMonth,
  PerStoreOverallPerMonth,
  PerStoreTopPerMonth,
  ProductResult,
  SearchAllStoreProductPerMonth,
  SearchPerStoreProductPerMonth,
} from '@/types/reportTypes';
import createPromotionAction from './createPromotionAction';

class SalesAction {
  public async getAllStoreOverallPerMonthAction(
    props: AllStoreOverallPerMonth,
  ): Promise<OverallProps> {
    const overallAllStore = await salesQuery.getStoresOverallByMonth(props);
    return overallAllStore;
  }

  public async getStoreOverallPerMonthAction(props: PerStoreOverallPerMonth) {
    const { id, role, ...otherProps } = props;
    await createPromotionAction.checkAdminAccess(role, id, props.storeId);

    const overallStore = await salesQuery.getStoresOverallByMonth(otherProps);
    return overallStore;
  }

  public async getAllStoreProductSalesPerMonthAction(
    props: SearchAllStoreProductPerMonth,
  ): Promise<{ products: ProductResult[]; totalCount: number }> {
    const productsAllStore =
      await salesQuery.getStoresProductSalesPerMonth(props);
    return productsAllStore;
  }

  public async getStoreProductSalesPerMonthAction(
    props: SearchPerStoreProductPerMonth,
  ): Promise<{ products: ProductResult[]; totalCount: number }> {
    const { id, role, ...otherProps } = props;
    await createPromotionAction.checkAdminAccess(role, id, props.storeId);

    const productsStore =
      await salesQuery.getStoresProductSalesPerMonth(otherProps);
    return productsStore;
  }

  public async getAllStoreCategorySalesPerMonthAction(
    props: AllStoreCategoryPerMonth,
  ): Promise<ProductResult[]> {
    const categoriesAllStore =
      await salesQuery.getStoresCategorySalesPerMonth(props);
    return categoriesAllStore;
  }

  public async getStoreCategorySalesPerMonthAction(
    props: PerStoreCategoryPerMonth,
  ): Promise<ProductResult[]> {
    const { id, role, ...otherProps } = props;
    await createPromotionAction.checkAdminAccess(role, id, props.storeId);

    const categoriesStore =
      await salesQuery.getStoresCategorySalesPerMonth(otherProps);
    return categoriesStore;
  }

  public async getAllStoreTopProductSalesPerMonthAction(
    props: AllStoreTopPerMonth,
  ): Promise<ProductResult[]> {
    const topProductsAllStore = await salesQuery.getStoresProductSalesPerMonth({
      ...props,
      orderBy: 'qtyDesc',
      page: 1,
      pageSize: props.top,
      keyword: '',
    });

    return topProductsAllStore.products;
  }

  public async getStoreTopProductSalesPerMonthAction(
    props: PerStoreTopPerMonth,
  ): Promise<ProductResult[]> {
    const { id, role, ...otherProps } = props;
    await createPromotionAction.checkAdminAccess(role, id, props.storeId);

    const topProductsStore = await salesQuery.getStoresProductSalesPerMonth({
      ...otherProps,
      orderBy: 'qtyDesc',
      page: 1,
      pageSize: props.top,
      keyword: '',
    });

    return topProductsStore.products;
  }

  public async getAllStoreTopCategorySalesPerMonthAction(
    props: AllStoreTopPerMonth,
  ) {
    const topCategoriesAllStore =
      await salesQuery.getStoresCategorySalesPerMonth({
        ...props,
        orderBy: 'qtyDesc',
      });

    return topCategoriesAllStore.slice(0, props.top);
  }

  public async getStoreTopCategorySalesPerMonthAction(
    props: PerStoreTopPerMonth,
  ) {
    const { id, role, ...otherProps } = props;

    await createPromotionAction.checkAdminAccess(role, id, props.storeId);

    const topCategoriesStore = await salesQuery.getStoresCategorySalesPerMonth({
      ...otherProps,
      orderBy: 'qtyDesc',
    });

    return topCategoriesStore.slice(0, props.top);
  }
}

export default new SalesAction();
