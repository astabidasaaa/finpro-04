export type CategoryProps = {
  id: number;
  name: string;
  subcategories: {
    id: number;
    name: string;
  }[];
};

export type TSubCategory = {
  id: number;
  name: string;
};

export type TCategory = {
  id: number;
  name: string;
  subcategories: TSubCategory[];
};
