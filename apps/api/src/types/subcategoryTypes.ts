export type CreateSubcategoryInput = {
  name: string;
  id: number;
  description?: string;
};

export type UpdateSubcategoryInput = {
  creatorId: number;
  subcategoryId: number;
  parentCategoryId?: number;
  name?: string;
};
