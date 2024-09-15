'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import StoresTable from './StoresTable';
import StorePagination from './StorePagination';
import { useSearchParams } from 'next/navigation';

const store_data = [
  {
    name: 'Store 1',
    address: '211 Margaretta Loaf, Suite 329',
    storeState: 'PUBLISHED',
    createdAt: '2024-08-28 00:27:37.000',
  },
  {
    name: 'Store 2',
    address: '9481 Ebert Burgs, Suite 395',
    storeState: 'PUBLISHED',
    createdAt: 'Sun Apr 07 2024 06:46:32 GMT+0700 (Western Indonesia Time)',
  },
  {
    name: 'Store 3',
    address: '306 Randal Cove, Apt. 820',
    storeState: 'PUBLISHED',
    createdAt: 'Fri Nov 24 2023 02:38:17 GMT+0700 (Western Indonesia Time)',
  },
  {
    name: 'Store 4',
    address: '2485 Simonis River, Apt. 455',
    storeState: 'DRAFT',
    createdAt: 'Fri Nov 24 2023 02:38:17 GMT+0700 (Western Indonesia Time)',
  },
  {
    name: 'Store 5',
    address: '10942 Beahan Highway, Suite 254',
    storeState: 'ARCHIVED',
    createdAt: 'Fri Nov 24 2023 02:38:17 GMT+0700 (Western Indonesia Time)',
  },
];

const StoresContent = () => {
  const searchParams = useSearchParams();
  const rawPage = searchParams.get('page') || '1';
  const page = parseInt(rawPage) < 1 ? 1 : parseInt(rawPage);
  const pageSize = 20;

  return (
    <div className="flex flex-col w-full space-y-4 py-4">
      <div className="flex flex-row justify-between items-center gap-4 w-full">
        <div className="relative w-full md:max-w-[336px]">
          <Input
            type="search"
            placeholder="Tulis nama / alamat / pembuat toko"
            className="pl-8"
          />
          <Search className="absolute left-2.5 top-3 size-4 text-muted-foreground" />
        </div>
        <Button
          variant="default"
          className="bg-main-dark hover:bg-main-dark/80"
        >
          <Plus className="size-4 mr-0 md:mr-2" />
          <span className="hidden md:inline-block">Tambah Toko</span>
        </Button>
      </div>
      <StoresTable stores={store_data} />
      <StorePagination
        totalStore={store_data.length}
        page={page}
        pageSize={pageSize}
      />
    </div>
  );
};

export default StoresContent;
