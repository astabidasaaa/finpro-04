import { $Enums, Inventory, InventoryUpdate } from '@prisma/client';

export type SearchAllInventoryInput = {
  id: number;
  keyword: string;
  page: number;
  pageSize: number;
  storeId?: number;
};

export type SearchStoreInventoryInput = {
  id: number;
  keyword: string;
  role: string;
  page: number;
  pageSize: number;
  storeId: number;
};

export type SearchAllInventoryUpdatesInput = {
  id: number;
  keyword: string;
  page: number;
  pageSize: number;
  storeId?: number;
  filterType?: $Enums.InventoryUpdateDetail;
  sortCol: string;
};

export type SearchStoreInventoryUpdatesInput = {
  id: number;
  keyword: string;
  role: string;
  page: number;
  pageSize: number;
  storeId: number;
  filterType?: string;
  sortCol: string;
};

export type CreateInventoryChangeInput = {
  id: number;
  productId: number;
  storeId: number;
  role: string;
  updateType: $Enums.InventoryUpdateType;
  updateDetail: $Enums.InventoryUpdateDetail;
  description?: string;
  stockChange: number;
};

export type InventoryProps = Inventory & {
  product: {
    name: string;
  };
  store: {
    name: string;
  };
};

export type InventoryUpdateProps = InventoryUpdate & {
  inventory: {
    product: {
      id: number;
      name: string;
    };
    store: {
      id: number;
      name: string;
    };
  };
};
