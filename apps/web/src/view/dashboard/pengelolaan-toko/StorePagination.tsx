'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const StorePagination = ({
  totalStore,
  page,
  pageSize,
}: {
  totalStore: number;
  page: number;
  pageSize: number;
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const startStore = (page - 1) * pageSize + 1;
  const endStore = Math.min(page * pageSize, totalStore);

  // calculate the total number of pages
  const totalPages = Math.ceil(totalStore / pageSize);

  // determine the state of the "older" and "newer" buttons
  const hasOlderPage = page > 1;
  const hasNewerPage = page < totalPages;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      router.push(`${pathname}?page=${page}`);
    }
  };

  // older and Newer button click handlers
  const handleOlderClick = () => {
    if (hasOlderPage) {
      goToPage(page - 1);
    }
  };

  const handleNewerClick = () => {
    if (hasNewerPage) {
      goToPage(page + 1);
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
          onClick={handleOlderClick}
          disabled={!hasOlderPage}
          className="size-6"
        >
          <ChevronLeft className="size-5" />
        </Button>
        <Button
          size="icon"
          variant="link"
          onClick={handleNewerClick}
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
