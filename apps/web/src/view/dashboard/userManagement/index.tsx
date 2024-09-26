'use client';
import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { AxiosError } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import UserTable from './UserTable';
import { SearchedUser } from '@/types/userType';
import { getCookie } from 'cookies-next';
import Pagination from '@/components/dashboard/Pagination';

export default function UserManagementView() {
  const [users, setUsers] = useState<SearchedUser[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);
  const pageSize = 15;
  const [page, setPage] = useState<number>(1);
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
      router.push(`/dashboard/account/user?${params.toString()}`);

      const result = await axiosInstance().get(
        `${process.env.API_URL}/admins/users?${params.toString()}&role=user`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUsers(result.data.data.users);
      setTotal(result.data.data.totalCount);
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
  }, [page, keyword, pageSize]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Akun Kustomer</h1>
      </div>
      <div className="w-full">
        <div className="flex items-start justify-between py-4 pr-5">
          <Input
            placeholder="Cari akun..."
            className="max-w-sm"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <UserTable data={users} />
        <div className="text-sm py-3">
          {users.length} dari {total} akun
        </div>
        <Pagination
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          total={total}
        />
      </div>
    </div>
  );
}
