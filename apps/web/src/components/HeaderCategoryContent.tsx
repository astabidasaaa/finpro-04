import React, { useEffect, useState } from 'react';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import Loading from './Loading';
import Error from '@/app/error';
import { Button } from './ui/button';
import Link from 'next/link';
import { TCategory } from '@/types/categoryTypes';

const HeaderCategoryContent = ({
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
  const [activeCategory, setActiveCategory] = useState<TCategory | undefined>(
    undefined,
  );

  useEffect(() => {
    if (data && data.length > 0) {
      setActiveCategory(data[0]);
    }
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError && error) {
    return <Error error={error} reset={refetch} />;
  }

  return (
    <>
      {data && data.length > 0 && (
        <div className="grid md:grid-cols-[.4fr_1fr] divide-x">
          <div className="flex flex-col max-h-[400px] overflow-auto pr-3">
            <div className="flex flex-col">
              {activeCategory &&
                data.map((category: TCategory) => (
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
                    <Link href={`/search?subcategoryId=${sub.id}`}>
                      {sub.name}
                    </Link>
                  </Button>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderCategoryContent;
