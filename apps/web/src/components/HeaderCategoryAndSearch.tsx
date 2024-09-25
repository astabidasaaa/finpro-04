import React, { useEffect } from 'react';
import { Input } from './ui/input';
import { Search } from 'lucide-react';
import HeaderCategoryBtn from './HeaderCategoryBtn';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { useAppSelector } from '@/lib/hooks';
import MobileCategoryMenu from './MobileCategoryMenu';

const HeaderCategoryAndSearch = () => {
  const router = useRouter();
  const [text, setText] = useState('');

  const nearestStore = useAppSelector((state) => state.storeId);
  const { storeId } = nearestStore;

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      router.push(`/search?keyword=${text}`);
    }
  }

  function handleNoString() {
    setTimeout(() => {
      router.push(`/search?`);
    }, 500);
  }

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryFn: async () => {
      const res = await axiosInstance().get(`/categories`);
      return res.data.data;
    },
    queryKey: ['main_category'],
  });

  useEffect(() => {
    refetch();
  }, [storeId]);

  return (
    <>
      <HeaderCategoryBtn
        data={data}
        isLoading={isLoading}
        isError={isError}
        error={error}
        refetch={refetch}
      />
      <MobileCategoryMenu data={data} />
      <div className="relative ml-auto flex-1 md:grow-0">
        <Input
          type="search"
          placeholder="Search..."
          onChange={(e) => {
            if (e.target.value !== '') {
              setText(e.target.value);
            } else {
              handleNoString();
            }
          }}
          onKeyDown={handleKeyDown}
          className="w-11/12 rounded-full bg-background pl-8 md:w-[200px] lg:w-[336px] h-8 md:h-10"
        />
        <Search className="absolute left-2.5 top-2 md:top-3 h-4 w-4 text-muted-foreground" />
      </div>
    </>
  );
};

export default HeaderCategoryAndSearch;
