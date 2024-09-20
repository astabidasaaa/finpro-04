'use client';

import React, { useEffect, useState } from 'react';
import StoresTable from './StoresTable';
import StorePagination from './StorePagination';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { getCookie } from 'cookies-next';
import Loading from '@/components/Loading';
import Error from '@/app/error';
import {
  TStoreManagementData,
  TStoreManagementQuery,
} from '@/types/storeTypes';
import SearchField from './SearchField';
import TambahTokoDialog from './TambahTokoDialog';
import FilterStatus from './FilterStatus';

const StoresContent = () => {
  const token = getCookie('access-token');

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [query, setQuery] = useState<TStoreManagementQuery>({
    state: null,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    pageSize: 20,
  });

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setQuery((prevQuery) => ({
        ...prevQuery,
        page: 1,
      }));
      refetch();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryFn: async (): Promise<TStoreManagementData> => {
      const res = await axiosInstance().get(`/store-management`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {
          keyword: searchTerm,
          state: query.state,
          sortBy: query.sortBy,
          sortOrder: query.sortOrder,
          page: query.page,
          pageSize: query.pageSize,
        },
      });

      return res.data.data;
    },
    queryKey: ['store_management', query],
  });

  return (
    <div className="flex flex-col w-full h-full space-y-4 py-4">
      <div className="flex flex-row justify-between items-center gap-4 w-full">
        <div className="flex flex-row gap-4">
          <SearchField searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <FilterStatus state={query.state} setQuery={setQuery} />
        </div>
        <TambahTokoDialog refetch={refetch} />
      </div>
      <div className="flex flex-col justify-center items-center w-full h-full">
        {isLoading ? (
          <Loading />
        ) : isError ? (
          <Error error={error} reset={refetch} />
        ) : (
          data && (
            <>
              <div className="h-full w-full">
                <StoresTable stores={data.stores} refetch={refetch} />
              </div>
              <StorePagination
                totalStore={data.totalStores}
                totalPages={data.totalPages}
                page={data.currentPage}
                pageSize={query.pageSize}
                setQuery={setQuery}
              />
            </>
          )
        )}
      </div>
    </div>
  );
};

export default StoresContent;
