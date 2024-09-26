export type InventoryProps = {
  id: number;
  productId: number;
  storeId: number;
  stock: number;
  createdAt: Date;
  product: {
    name: string;
    subcategory: {
      name: string;
    };
  };
  store: {
    name: string;
  };
};

export enum UpdateType {
  ADD = 'Tambah',
  REMOVE = 'Kurang',
}

export enum UpdateDetail {
  STOCK_IN = 'Stok masuk',
  STOCK_OUT = 'Stok keluar',
  ADJUSTMENT = 'Penyesuaian',
  DAMAGED = 'Rusak',
  EXPIRATION = 'Kadaluarsa',
  CANCELLED_ORDER = 'Order dibatalkan',
}

export enum InventoryUpdateType {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
}

export enum InventoryUpdateDetail {
  STOCK_IN = 'STOCK_IN',
  STOCK_OUT = 'STOCK_OUT',
  ADJUSTMENT = 'ADJUSTMENT',
  DAMAGED = 'DAMAGED',
  EXPIRATION = 'EXPIRATION',
  CANCELLED_ORDER = 'CANCELLED_ORDER',
}

export enum SortTime {
  TIMEDESC = 'timeDesc',
  TIMEASC = 'timeAsc',
}

export type InventoryUpdateProps = {
  id: number;
  creatorId: number;
  inventoryId: number;
  type: InventoryUpdateType;
  detail: InventoryUpdateDetail;
  description: string | null;
  stockChange: number;
  createdAt: Date;
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
