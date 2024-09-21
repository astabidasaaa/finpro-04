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
  filterType?: string;
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

export enum UpdateDetailDesc {
  STOCK_IN = 'Stok masuk',
  STOCK_OUT = 'Stok keluar',
  ADJUSTMENT = 'Penyesuaian',
  DAMAGED = 'Rusak',
  EXPIRATION = 'Kadaluarsa',
  CANCELLED_ORDER = 'Order dibatalkan',
}

export enum UpdateTypeDesc {
  ADD = 'Tambah',
  REMOVE = 'Kurang',
}

export type ProductInventoryChange = {
  id: number;
  role: string;
  month: number;
  year: number;
  inventoryId: number;
  orderBy: string;
};

export type ProductStockChange = {
  id: number;
  name: string;
  totalAdd: number;
  totalRemove: number;
  lastStock: number;
};
