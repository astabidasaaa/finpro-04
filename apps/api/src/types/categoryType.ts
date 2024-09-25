export type CategoryWithSubcategories = {
  id: number;
  name: string;
  subcategories: {
    id: number;
    name: string;
  }[];
};
