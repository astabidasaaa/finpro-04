export type ProductProps = {
  id: number;
  creatorId: number;
  name: string;
  brandId: number | null;
  subcategoryId: number;
  description: string;
  productState: State;
  createdAt: Date;
  updatedAt: Date;
  prices: {
    price: number;
  }[];
  images: {
    id: number;
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
    productCategory: {
      id: true;
      name: true;
    };
  };
};

type Product = {
  id: number;
  creatorId: number;
  name: string;
  brandId: number | null;
  subcategoryId: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductDetailProps = {
  id: number;
  productId: number;
  storeId: number;
  stock: number;
  createdAt: Date;
  product: Product & {
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
    subcategory: {
      name: string;
      productCategory: {
        name: string;
      };
    };
  };
  productDiscountPerStores: ProductDiscountProps[];
  freeProductPerStores: FreeProductProps[];
};

export type ProductDiscountProps = {
  discountType: DiscountType;
  discountValue: number;
};

export type FreeProductProps = {
  get: number;
  buy: number;
};

export type ProductsSearchedProps = {
  totalCount: number;
  products: ProductProps[];
};

export enum DiscountType {
  FLAT = 'FLAT',
  PERCENT = 'PERCENT',
}
export enum State {
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
