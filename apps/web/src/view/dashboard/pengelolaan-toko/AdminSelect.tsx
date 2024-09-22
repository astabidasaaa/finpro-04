'use client';

import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { FormControl } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { getCookie } from 'cookies-next';
import { TSelectAdmin } from '@/types/storeTypes';
import { cn } from '@/lib/utils';
import { CheckIcon, PlusCircle, X } from 'lucide-react';
import Loading from '@/components/Loading';

const AdminSelect = ({
  field,
  handleAdminSelect,
}: {
  field: any;
  handleAdminSelect: (adminId: number) => void;
}) => {
  const token = getCookie('access-token');

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryFn: async (): Promise<TSelectAdmin[]> => {
      const res = await axiosInstance().get(`/admins/select`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data.data.admins;
    },
    queryKey: ['store_admins'],
  });

  return (
    <Popover modal={true}>
      <div className="flex flex-row flex-wrap gap-1.5 min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
        {data &&
          data.length > 0 &&
          data
            .filter((option) => field.value.includes(option.id))
            .map((option) => (
              <Badge
                variant="secondary"
                key={option.id}
                className="rounded-md px-2 py-1 font-normal"
              >
                {option.profile.name || option.email}
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-max w-max"
                  onClick={() => handleAdminSelect(option.id)}
                >
                  <X className="size-3" />
                </Button>
              </Badge>
            ))}
      </div>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-dashed !mt-2"
          >
            <PlusCircle className="size-3 mr-2" /> Tambah
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent
        className="w-[320px] md:w-[360px] p-0 overflow-y-auto"
        align="start"
      >
        {isLoading ? (
          <Loading />
        ) : (
          <Command className="max-h-[320px]">
            <CommandInput placeholder="Cari admin" />
            <CommandList>
              <CommandEmpty>Admin tidak ditemukan.</CommandEmpty>
              <CommandGroup>
                {data &&
                  data.length > 0 &&
                  data.map((option) => {
                    const isSelected = field.value.includes(option.id);
                    return (
                      <CommandItem
                        key={option.id}
                        onSelect={() => handleAdminSelect(option.id)}
                      >
                        <div
                          className={cn(
                            'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                            isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'opacity-50 [&_svg]:invisible',
                          )}
                        >
                          <CheckIcon className={cn('h-4 w-4')} />
                        </div>
                        <div className="flex flex-row justify-between items-center gap-2 w-full text-xs">
                          <span className="font-medium tracking-wide">
                            {option.profile.name || option.email}
                          </span>
                          <span className="text-muted-foreground">
                            {option.store?.name || ''}
                          </span>
                        </div>
                      </CommandItem>
                    );
                  })}
              </CommandGroup>
            </CommandList>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default AdminSelect;
