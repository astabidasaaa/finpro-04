import React, { useEffect, useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import HeaderCategoryContent from './HeaderCategoryContent';

const HeaderCategoryBtn = () => {
  return (
    <NavigationMenu className="hidden md:block">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Kategori</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="p-6 md:w-[640px] lg:w-[800px] xl:w-[1000px] h-[400px]">
              <HeaderCategoryContent />
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default HeaderCategoryBtn;
