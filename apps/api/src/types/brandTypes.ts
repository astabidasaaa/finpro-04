export type UpdateBrandInput = {
  creatorId: number;
  brandId: number;
  name?: string;
  description?: string;
};

export type CreateBrandInput = {
  name: string;
  creatorId: number;
  description?: string;
};
