export type TStore = {
  name: string;
};

export type TImage = {
  title: string;
};

export type TInventory = {
  storeId: number;
  stock: number;
  store: TStore;
};

export type TPrice = {
  price: number;
};

export type TProduct = {
  id: number;
  name: string;
  description: string;
  images: TImage[];
  inventories: TInventory[];
  prices: TPrice[];
};

export type TSubCategory = {
  id: number;
  name: string;
  products: TProduct[];
};

export type TCategory = {
  id: number;
  name: string;
  subcategories: TSubCategory[];
};

export type StoreProps = {
  name: string;
  id: number;
};
