import { $Enums, Inventory, Product } from '@prisma/client';

export enum Sort {
  'priceAsc' = 'priceAsc',
  'priceDesc' = 'priceDesc',
  'nameAsc' = 'nameAsc',
  'nameDesc' = 'nameDesc',
  'promo' = 'promo',
}

export type SearchedProduct = Product & {
  prices: {
    price: number;
  }[];
  images: {
    title: string;
    alt: string | null;
  }[];
  inventories: {
    stock: number;
    productDiscountPerStores: {
      discountType: $Enums.DiscountType;
      discountValue: number;
    }[];
    freeProductPerStores: {
      get: number;
      buy: number;
    }[];
  }[];
  brand: {
    name: string;
    id: number;
  } | null;
  subcategory: {
    name: string;
  };
};

export type SearchProductInput = {
  keyword: string;
  storeId: number;
  subcategoryId?: number;
  brandId?: number;
  startPrice?: number;
  endPrice?: number;
  sortCol: string;
  page: number;
  pageSize: number;
};

export type CreateProductInput = {
  name: string;
  creatorId: number;
  brandId: number;
  subcategoryId: number;
  description: string;
  productState: $Enums.State;
  price: number;
  images: string[];
};

export type UpdateProductInput = {
  productId: number;
  name?: string;
  creatorId: number;
  brandId?: number;
  subcategoryId?: number;
  description?: string;
  productState?: $Enums.State;
  price?: number;
  images?: string[];
  imagesToDelete?: number[];
};

export type ProductProps = Product & {
  prices: {
    active: boolean;
    price: number;
    startDate: Date;
  }[];
  images: {
    id: number;
    title: string;
    alt: string | null;
  }[];
};

export type ProductDetailProps = Inventory & { product: ProductProps } & {
  productDiscountPerStores: {
    discountType: $Enums.DiscountType;
    discountValue: number;
  }[];
  freeProductPerStores: {
    get: number;
    buy: number;
  }[];
};
