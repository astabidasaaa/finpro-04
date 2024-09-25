import React from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { TCategory } from '@/types/categoryTypes';
import MobileCategoryMenuContent from './MobileCategoryMenuContent';

const MobileCategoryMenu = ({ data }: { data: TCategory[] }) => {
  return (
    <div className="block md:hidden fixed top-12 left-0 right-0 w-full h-8 bg-main-dark">
      {data && data.length > 0 && (
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max gap-10 p-2">
            {data.map((category: TCategory) => (
              <MobileCategoryMenuContent
                key={`category-${category.id}`}
                category={category}
              />
            ))}
          </div>
          <ScrollBar className="h-1.5" orientation="horizontal" />
        </ScrollArea>
      )}
    </div>
  );
};

export default MobileCategoryMenu;
