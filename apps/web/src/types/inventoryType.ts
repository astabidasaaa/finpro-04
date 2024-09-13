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
