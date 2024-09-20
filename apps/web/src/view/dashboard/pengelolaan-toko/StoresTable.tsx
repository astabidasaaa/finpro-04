import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TStoreManagement, TStoreManagementData } from '@/types/storeTypes';
import { truncateText } from '@/lib/utils';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import EditTokoDialog from './EditTokoDialog';
import DeleteTokoDialog from './DeleteTokoDialog';

const StoresTable = ({
  stores,
  refetch,
}: {
  stores: TStoreManagement[];
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<TStoreManagementData, Error>>;
}) => {
  return (
    <Table className="h-full">
      <TableHeader>
        <TableRow>
          <TableHead className="w-40 xl:w-60 2xl:w-72">Nama Toko</TableHead>
          <TableHead className="w-56 xl:w-64 2xl:w-80 hidden lg:table-cell">
            Alamat
          </TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="hidden xl:table-cell text-center">
            Admin Toko
          </TableHead>
          <TableHead className="hidden sm:table-cell">Dibuat pada</TableHead>
          <TableHead className="w-10">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stores &&
          stores.map((store, index: number) => {
            const createdDate = new Date(store.createdAt).toLocaleString(
              'id-ID',
              {
                hour12: false,
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              },
            );

            return (
              <TableRow key={`toko-${index}`}>
                <TableCell className="w-40 xl:w-60 2xl:w-72 font-medium">
                  {store.name}
                </TableCell>
                <TableCell className="w-56 xl:w-64 2xl:w-80 hidden lg:table-cell text-xs xl:text-sm">
                  {truncateText(store.addresses[0].address, 40)}
                </TableCell>
                <TableCell>
                  <div className="w-full flex justify-center">
                    <Badge
                      variant={
                        store.storeState === 'PUBLISHED'
                          ? 'default'
                          : store.storeState === 'DRAFT'
                            ? 'outline'
                            : 'secondary'
                      }
                      className={`mx-auto text-[8px] tracking-wider ${store.storeState === 'PUBLISHED' && 'bg-emerald-500 hover:bg-emerald-500/80'}`}
                    >
                      {store.storeState}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="hidden xl:table-cell text-center text-xs xl:text-sm">
                  {store._count.admins}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-xs xl:text-sm">
                  {createdDate}
                </TableCell>
                <TableCell className="flex flex-row gap-1 md:gap-2">
                  <EditTokoDialog refetch={refetch} store={store} />
                  <DeleteTokoDialog refetch={refetch} store={store} />
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
};

export default StoresTable;
