export type ProductProps = {
  id: number;
  creatorId: number;
  name: string;
  brandId: number;
  subcategoryId: number;
  description: string;
  productState: State;
  createdAt: Date;
  updatedAt: Date;
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
      discountType: DiscountType;
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
  };
  subcategory: {
    name: string;
  };
};

export type ProductsSearchedProps = {
  totalCount: number;
  products: ProductProps[];
};

enum DiscountType {
  FLAT = 'FLAT',
  PERCENT = 'PERCENT',
}
enum State {
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
  ARCHIVED = 'ARCHIVED',
}

export enum OrderBy {
  priceAsc = 'Harga tertinggi',
  priceDesc = 'Harga terendah',
  nameAsc = 'Nama A-Z',
  nameDesc = 'Nama Z-A',
}
