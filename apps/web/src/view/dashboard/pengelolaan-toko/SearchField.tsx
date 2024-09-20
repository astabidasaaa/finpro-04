import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const SearchField = ({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="relative w-full md:max-w-[336px] ">
      <Input
        type="search"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Tulis nama / alamat / pembuat toko"
        className="pl-8"
      />
      <Search className="absolute left-2.5 top-3 size-4 text-muted-foreground" />
    </div>
  );
};

export default SearchField;
