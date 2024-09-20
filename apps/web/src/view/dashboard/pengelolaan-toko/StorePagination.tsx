'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TStoreManagementQuery } from '@/types/storeTypes';

type StorePaginationProps = {
  totalStore: number;
  totalPages: number;
  page: number;
  pageSize: number;
  setQuery: React.Dispatch<React.SetStateAction<TStoreManagementQuery>>;
};

const StorePagination = ({
  totalStore,
  totalPages,
  page,
  pageSize,
  setQuery,
}: StorePaginationProps) => {
  const startStore = (page - 1) * pageSize + 1;
  const endStore = Math.min(page * pageSize, totalStore);

  const hasOlderPage = page > 1;
  const hasNewerPage = page < totalPages;

  const handlePagination = (newPage: number) => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      page: newPage,
    }));
  };

  const handlePrevious = () => {
    if (hasOlderPage) {
      handlePagination(page - 1);
    }
  };

  const handleNext = () => {
    if (hasNewerPage) {
      handlePagination(page + 1);
    }
  };
  return (
    <div className="flex flex-col sm:flex-row justify-end items-center gap-2 sm:gap-6 w-full">
      <div className="text-xs text-muted-foreground">
        Menampilkan{' '}
        <strong>{totalStore ? `${startStore}-${endStore}` : 0}</strong> dari{' '}
        <strong>{totalStore || 0}</strong> toko
      </div>
      <div className="flex flex-row gap-2">
        <Button
          size="icon"
          variant="link"
          onClick={handlePrevious}
          disabled={!hasOlderPage}
          className="size-6"
        >
          <ChevronLeft className="size-5" />
        </Button>
        <Button
          size="icon"
          variant="link"
          onClick={handleNext}
          disabled={!hasNewerPage}
          className="size-6"
        >
          <ChevronRight className="size-5" />
        </Button>
      </div>
    </div>
  );
};

export default StorePagination;
