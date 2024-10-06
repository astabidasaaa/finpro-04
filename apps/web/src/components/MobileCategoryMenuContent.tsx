'use client';

import React, { useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { TCategory, TSubCategory } from '@/types/categoryTypes';
import { X } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

const MobileCategoryMenuContent = ({ category }: { category: TCategory }) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger className="text-xs font-semibold text-secondary">
        {category.name}
      </DrawerTrigger>
      <DrawerContent className="max-h-[70vh]">
        <DrawerHeader>
          <DrawerTitle>{category.name}</DrawerTitle>
          <DrawerDescription className="sr-only">
            Menu subkategori untuk kategori {category.name}
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="whitespace-nowrap w-full px-4 my-4">
          <div className="flex flex-col justify-start flex-wrap w-max h-[20vh] gap-y-4 gap-x-10">
            {category.subcategories.map((subcategory: TSubCategory) => {
              return (
                <Button
                  key={`subcategory-${subcategory.id}`}
                  variant="link"
                  className="w-32 text-main-dark text-sm font-light p-0 h-max items-start justify-start whitespace-normal [overflow-wrap:anywhere]"
                  onClick={() => setOpen((prev) => false)}
                  asChild
                >
                  <a href={`/search?subcategoryId=${subcategory.id}`}>
                    {subcategory.name}
                  </a>
                </Button>
              );
            })}
          </div>
          <ScrollBar className="h-1.5" orientation="horizontal" />
        </ScrollArea>
        <DrawerFooter className="flex justify-center items-center w-full">
          <DrawerClose>
            <X className="size-4" />
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileCategoryMenuContent;
