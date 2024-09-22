import { DiscountType } from './productTypes';

export type TStore = {
  name: string;
};

export type TImage = {
  title: string;
};

export type TInventory = {
  storeId: number;
  store: TStore;
  stock: number;
  productDiscountPerStores: {
    discountType: DiscountType;
    discountValue: number;
  }[];
  freeProductPerStores: {
    get: number;
    buy: number;
  }[];
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

export type TStoreManagement = {
  id: number;
  name: string;
  storeState: string;
  createdAt: string;
  _count: {
    admins: number;
  };
  creator: {
    email: string;
    profile: {
      name: string;
    };
  };
  addresses: [
    {
      id: number;
      address: string;
      latitude: string;
      longitude: string;
    },
  ];
  admins: [
    {
      id: number;
      email: string;
      profile: {
        name: string;
      };
    },
  ];
};

export type TStoreManagementData = {
  stores: TStoreManagement[];
  totalStores: number;
  currentPage: number;
  totalPages: number;
};

export type TStoreManagementQuery = {
  state: string | null;
  sortBy: string;
  sortOrder: string;
  page: number;
  pageSize: number;
};

export type TSelectAdmin = {
  id: number;
  email: string;
  profile: {
    name: string;
  };
  role: {
    name: string;
  };
  store: {
    id: number;
    name: string;
  };
};

export type TUpdateStore = {
  storeName?: string | undefined;
  storeState?: string | undefined;
  storeAddress?:
    | {
        address?: string | undefined;
        latitude?: string | undefined;
        longitude?: string | undefined;
      }
    | undefined;
  storeAdmins?: number[] | undefined;
};
