'use client';
import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { AxiosError } from 'axios';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import AdminTable from './AdminTable';
import { SearchedUser, UserType } from '@/types/userType';
import AdminFilter from './AdminFilter';
import StoreFilter from './StoreFilter';
import { StoreProps } from '@/types/storeTypes';
import { AddAdminButton } from './AddAdminButton';
import { getCookie } from 'cookies-next';

export default function AdminManagementView() {
  const [users, setUsers] = useState<SearchedUser[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);
  const pageSize = 15;
  const [page, setPage] = useState<number>(1);
  const [storeId, setStoreId] = useState<number>();
  const [stores, setStores] = useState<StoreProps[]>([]);
  const [role, setRole] = useState<UserType>(UserType.STOREADMIN);
  const totalPages = Math.ceil(total / pageSize);
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  const router = useRouter();
  const [inputValue, setInputValue] = useState<string>('');
  const [keyword, setKeyword] = useState<string>('');
  const searchParams = useSearchParams();
  const token = getCookie('access-token');

  async function fetchData() {
    try {
      const params = new URLSearchParams(searchParams as any);
      const filters = {
        keyword: keyword,
        storeId: storeId,
        role: role,
        page: page,
        pageSize: pageSize,
      };

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.set(key, value.toString());
        } else {
          params.delete(key);
        }
      });
      router.push(`/dashboard/account/admin?${params.toString()}`);

      const userResult = await axiosInstance().get(
        `${process.env.API_URL}/admins/users?${params.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const storeResult = await axiosInstance().get(
        `${process.env.API_URL}/stores/admin`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUsers(userResult.data.data.users);
      setTotal(userResult.data.data.totalCount);
      setStores(storeResult.data.data);
      setIsMounted(true);
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
  }, [page, keyword, pageSize, role, storeId]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Administrator</h1>
      </div>
      <div className="w-full">
        <div className="flex items-start justify-between py-4">
          <Input
            placeholder="Cari akun..."
            className="max-w-sm"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <AddAdminButton />
        </div>
        <div className="flex flex-col gap-y-3 pb-4">
          <AdminFilter role={role} setRole={setRole} setStoreId={setStoreId} />
          {role === UserType.STOREADMIN && (
            <StoreFilter stores={stores} setStoreId={setStoreId} />
          )}
        </div>
        <AdminTable data={users} />
        <div className="text-sm py-3">
          {users.length} dari {total} akun
        </div>
        <Pagination>
          <PaginationContent>
            {pages.map((page, index) => (
              <PaginationItem key={index}>
                <PaginationLink onClick={() => setPage(page)}>
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
