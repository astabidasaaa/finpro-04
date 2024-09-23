import axiosInstance from '@/lib/axiosInstance';
import { ProductAndCategoryReport } from '@/types/salesType';
import { CookieValueTypes } from 'cookies-next';

export async function fetchStore(
  userId: number,
  token: CookieValueTypes,
): Promise<number> {
  const storeResult = await axiosInstance().get(
    `${process.env.API_URL}/stores/single/${userId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return storeResult.data.data.id;
}

export async function fetchProductStoreAdmin(
  storeId: number | undefined,
  token: CookieValueTypes,
  keyword: string,
  orderBy: string,
  page: number,
  pageSize: number,
  year: number,
  month: number,
): Promise<{ products: ProductAndCategoryReport[]; totalCount: number }> {
  const productResult = await axiosInstance().get(
    `${process.env.API_URL}/sales/product/single/${storeId}?keyword=${keyword}&orderBy=${orderBy}&page=${page}&pageSize=${pageSize}&year=${year}&month=${month}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return productResult.data.data;
}

export async function fetchCategoryStoreAdmin(
  storeId: number | undefined,
  token: CookieValueTypes,
  month: number,
  year: number,
): Promise<ProductAndCategoryReport[]> {
  const categoryResult = await axiosInstance().get(
    `${process.env.API_URL}/sales/category/single/${storeId}?month=${month}&year=${year}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return categoryResult.data.data;
}

export async function fetchProductSuperAdmin(
  storeId: number | undefined,
  token: CookieValueTypes,
  keyword: string,
  orderBy: string,
  page: number,
  pageSize: number,
  year: number,
  month: number,
): Promise<{ products: ProductAndCategoryReport[]; totalCount: number }> {
  const productResult = await axiosInstance().get(
    `${process.env.API_URL}/sales/product/all-store?keyword=${keyword}&orderBy=${orderBy}&page=${page}&pageSize=${pageSize}&year=${year}&month=${month}&storeId=${storeId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return productResult.data.data;
}

export async function fetchCategorySuperAdmin(
  storeId: number | undefined,
  token: CookieValueTypes,
  month: number,
  year: number,
): Promise<ProductAndCategoryReport[]> {
  const categoryResult = await axiosInstance().get(
    `${process.env.API_URL}/sales/category/all-store?month=${month}&year=${year}&storeId=${storeId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return categoryResult.data.data;
}
