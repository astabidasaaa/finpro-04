import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import axiosInstance from '@/lib/axiosInstance';
import Loading from './Loading';
import Error from '@/app/error';
import { Button } from './ui/button';
import Link from 'next/link';

type TSubCategory = {
  id: number;
  name: string;
};

type TCategory = {
  id: number;
  name: string;
  subcategories: TSubCategory[];
};

type TApiResponse = {
  data: {
    data: {
      categories: TCategory[];
    };
    message: string;
  };
};

const HeaderCategoryBtn = () => {
  const { data, isLoading, isError, error, refetch } = useQuery<
    TApiResponse,
    Error
  >({
    queryFn: async () => await axiosInstance().get(`/categories/`),
    queryKey: ['main_category'],
  });

  const [activeCategory, setActiveCategory] = useState<TCategory | undefined>(
    undefined,
  );

  useEffect(() => {
    if (
      data?.data.data.categories &&
      data?.data?.data?.categories?.length > 0
    ) {
      setActiveCategory(data?.data.data.categories[0]);
    }
  }, [data]);

  return (
    <NavigationMenu className="hidden md:block">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Kategori</NavigationMenuTrigger>
          <NavigationMenuContent>
            {isLoading ? (
              <Loading />
            ) : isError ? (
              <div className="flex justify-center items-center w-full min-h-[120px] md:min-h-[320px]">
                <Error error={error} reset={refetch} />
              </div>
            ) : (
              data?.data?.data?.categories &&
              data.data.data.categories.length > 0 && (
                <div className="grid p-6 md:w-[640px] lg:w-[800px] xl:w-[1000px] md:grid-cols-[.4fr_1fr] h-[400px] divide-x">
                  <div className="flex flex-col max-h-[400px] overflow-auto pr-3">
                    <div className="flex flex-col">
                      {activeCategory &&
                        data.data.data.categories.map((category: TCategory) => (
                          <Button
                            key={category.id}
                            variant="link"
                            onMouseEnter={() => setActiveCategory(category)}
                            className={`justify-start h-max text-start whitespace-break-spaces ${category.id === activeCategory.id && 'bg-main'} `}
                          >
                            {category.name}
                          </Button>
                        ))}
                    </div>
                  </div>
                  <div className="flex flex-col max-h-[400px] overflow-auto pl-3 lg:pl-8">
                    <div className="flex flex-col flex-wrap gap-y-2 md:gap-x-8 lg:gap-x-4 max-h-[800px]">
                      {activeCategory &&
                        activeCategory.subcategories.map((sub, index) => (
                          <Button
                            variant="link"
                            key={`${sub.id}-${index}`}
                            className="justify-start py-1 h-max max-w-48 lg:max-w-56 text-start whitespace-break-spaces"
                            asChild
                          >
                            <Link
                              href={`/search?subcategory=${sub.name}&storeId=1`}
                            >
                              {sub.name}
                            </Link>
                          </Button>
                        ))}
                    </div>
                  </div>
                </div>
              )
            )}
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default HeaderCategoryBtn;
