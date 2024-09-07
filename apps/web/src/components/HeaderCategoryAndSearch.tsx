import React from 'react';
import { Input } from './ui/input';
import { Search } from 'lucide-react';
import HeaderCategoryBtn from './HeaderCategoryBtn';

const HeaderCategoryAndSearch = () => {
  return (
    <>
      <HeaderCategoryBtn />
      <div className="relative ml-auto flex-1 md:grow-0">
        <Input
          type="search"
          placeholder="Search..."
          className="w-4/5 rounded-full bg-background pl-8 md:w-[200px] lg:w-[336px] h-8 md:h-10"
        />
        <Search className="absolute left-2.5 top-2 md:top-3 h-4 w-4 text-muted-foreground" />
      </div>
    </>
  );
};

export default HeaderCategoryAndSearch;
