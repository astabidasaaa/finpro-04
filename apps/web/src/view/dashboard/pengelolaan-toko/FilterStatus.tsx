import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ListFilter } from 'lucide-react';
import { TStoreManagementQuery } from '@/types/storeTypes';

const FilterStatus = ({
  state,
  setQuery,
}: {
  state: string | null;
  setQuery: React.Dispatch<React.SetStateAction<TStoreManagementQuery>>;
}) => {
  const handleStateChange = (value: string) => {
    if (value === 'NULL') {
      setQuery((prevQuery) => ({
        ...prevQuery,
        state: null,
        page: 1,
      }));
    } else {
      setQuery((prevQuery) => ({
        ...prevQuery,
        state: value || null,
        page: 1,
      }));
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-1.5">
          <ListFilter className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Status
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Status Toko</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={state || 'NULL'}
          onValueChange={handleStateChange}
        >
          <DropdownMenuRadioItem value="NULL">Semua</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="DRAFT">Draft</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="PUBLISHED">
            Published
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterStatus;
