import { Input } from '@/components/ui/input';
import SelectOrderBy from './SelectOrderBy';
import Pagination from '@/components/dashboard/Pagination';
import ProductReportTable from './ProductReportTable';
import { useEffect, useState } from 'react';
import { User, UserType } from '@/types/userType';
import { AxiosError } from 'axios';
import {
  fetchProductStoreAdmin,
  fetchProductSuperAdmin,
  fetchStore,
} from './fetchSales';
import { getCookie } from 'cookies-next';
import { ProductAndCategoryReport } from '@/types/salesType';

export default function ProductSalesDashboard({
  selectedYear,
  selectedMonth,
  storeId,
  user,
}: {
  selectedYear: number;
  selectedMonth: number;
  storeId: number | undefined;
  user: User;
}) {
  const [productSales, setProductSales] = useState<ProductAndCategoryReport[]>(
    [],
  );
  const [total, setTotal] = useState<number>(0);
  const [keyword, setKeyword] = useState<string>('');
  const [orderBy, setOrderBy] = useState('nameAsc');
  const pageSize = 10;
  const [page, setPage] = useState<number>(1);
  const [inputValue, setInputValue] = useState<string>('');

  const token = getCookie('access-token');

  async function fetchData() {
    try {
      if (user.role === UserType.STOREADMIN) {
        const storeAdminId = await fetchStore(user.id, token);

        const productResult = await fetchProductStoreAdmin(
          storeAdminId,
          token,
          keyword,
          orderBy,
          page,
          pageSize,
          selectedYear,
          selectedMonth,
        );
        setProductSales(productResult.products);
        setTotal(productResult.totalCount);
      } else if (user.role == UserType.SUPERADMIN) {
        const productResult = await fetchProductSuperAdmin(
          storeId,
          token,
          keyword,
          orderBy,
          page,
          pageSize,
          selectedYear,
          selectedMonth,
        );
        setProductSales(productResult.products);
        setTotal(productResult.totalCount);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        alert(err.response?.data.message);
      } else {
        alert('Data is not fetched');
      }
    }
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      setKeyword(inputValue);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

  useEffect(() => {
    fetchData();
  }, [storeId, selectedMonth, selectedYear, keyword, orderBy, page]);

  return (
    <>
      <div className="flex items-start justify-between py-4">
        <Input
          placeholder="Cari produk..."
          className="max-w-sm"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <SelectOrderBy setOrderBy={setOrderBy} />
      </div>
      <ProductReportTable data={productSales} />
      <div className="h-4" />
      <Pagination
        page={page}
        setPage={setPage}
        total={total}
        pageSize={pageSize}
      />
    </>
  );
}
