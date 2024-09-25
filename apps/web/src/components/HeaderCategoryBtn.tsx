import React from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import HeaderCategoryContent from './HeaderCategoryContent';
import { TCategory } from '@/types/categoryTypes';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';

const HeaderCategoryBtn = ({
  data,
  isLoading,
  isError,
  error,
  refetch,
}: {
  data: TCategory[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<any, Error>>;
}) => {
  return (
    <NavigationMenu className="hidden md:block">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Kategori</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="p-6 md:w-[640px] lg:w-[800px] xl:w-[1000px] h-[400px]">
              <HeaderCategoryContent
                data={data}
                isLoading={isLoading}
                isError={isError}
                error={error}
                refetch={refetch}
              />
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default HeaderCategoryBtn;
