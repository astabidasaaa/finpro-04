'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ProductProps, State } from '@/types/productTypes';
import { useRouter } from 'next/navigation';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { IDR } from '@/lib/utils';
import SeeDetailDialogButton from './SeeDetailDialogButton';
import ArchiveAlertButton from './ArchivedAlertButton';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import Link from 'next/link';
import EditProductButton from './EditProductButton';

export const columns: ColumnDef<ProductProps>[] = [
  {
    accessorKey: 'name',
    header: () => <div className="text-left">Nama</div>,
    cell: ({ row }) => {
      return (
        <div className="font-medium flex items-center">
          {row.getValue('name')}
        </div>
      );
    },
  },
  {
    accessorKey: 'brand',
    header: () => <div className="text-left">Brand</div>,
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="font-normal flex items-center">
          {product.brand?.name || ''}
        </div>
      );
    },
  },
  {
    accessorKey: 'category',
    header: () => <div className="text-left">Kategori</div>,
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="font-normal flex items-center">
          {product.subcategory.productCategory.name}
        </div>
      );
    },
  },
  {
    accessorKey: 'subcategory',
    header: () => <div className="text-left">Subkategori</div>,
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="font-normal flex items-center">
          {product.subcategory.name}
        </div>
      );
    },
  },
  {
    accessorKey: 'prices',
    header: () => <div className="text-left">Harga</div>,
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="font-normal flex items-center">
          {IDR.format(product.prices[0].price)}
        </div>
      );
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="flex space-x-2">
          <SeeDetailDialogButton product={product} />
          <EditProductButton productId={product.id} />
          {(product.productState === State.DRAFT ||
            product.productState === State.PUBLISHED) && (
            <ArchiveAlertButton product={product} />
          )}
        </div>
      );
    },
  },
];

export default function ProductTable({ data }: { data: ProductProps[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const router = useRouter();

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="w-full rounded-md border">
      <ScrollArea className="w-[calc(100vw_-_48px)] md:w-full max-w-full rounded-md overflow-auto">
        <Table className="">
          <TableHeader className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="cursor-pointer">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
