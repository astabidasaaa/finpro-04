export type AllStoreOverallPerMonth = {
  month: number;
  year: number;
  storeId: number | undefined;
};

export type PerStoreOverallPerMonth = {
  id: number;
  role: string;
  month: number;
  year: number;
  storeId: number;
};

export type SearchAllStoreProductPerMonth = {
  month: number;
  year: number;
  storeId: number | undefined;
  page: number;
  pageSize: number;
  keyword: string | undefined;
  orderBy: string;
};

export type SearchPerStoreProductPerMonth = {
  id: number;
  role: string;
  month: number;
  year: number;
  storeId: number;
  page: number;
  pageSize: number;
  keyword: string;
  orderBy: string;
};

export type AllStoreCategoryPerMonth = {
  month: number;
  year: number;
  storeId: number | undefined;
  orderBy: string;
};

export type PerStoreCategoryPerMonth = {
  id: number;
  role: string;
  month: number;
  year: number;
  storeId: number;
  orderBy: string;
};

export type AllStoreTopPerMonth = {
  month: number;
  year: number;
  storeId: number;
  top: number;
};

export type PerStoreTopPerMonth = {
  id: number;
  role: string;
  month: number;
  year: number;
  storeId: number;
  top: number;
};

export type OverallProps = {
  cleanRevenue: number | null;
  productRevenue: number | null;
  deliveryRevenue: number;
  transactionCount: number;
  itemCount: number | null;
};

export type ProductResult = {
  name: string;
  totalQty: number;
  totalPrice: number;
};
