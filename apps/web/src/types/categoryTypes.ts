export type CategoryProps = {
  id: number;
  name: string;
  subcategories: {
    id: number;
    name: string;
  }[];
};
