'use client';
import * as React from 'react';
import {
  ColumnDef,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SearchedUser } from '@/types/userType';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { DialogShowProductDetail } from './ActionButton';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { InventoryProps } from '@/types/inventoryType';
import { data } from 'cypress/types/jquery';

export const columns: ColumnDef<InventoryProps>[] = [
  {
    accessorKey: 'product',
    header: () => <div className="text">Nama Produk</div>,
    cell: ({ row }) => {
      const { product } = row.original;
      return (
        <div className="font-medium flex items-center">{product.name}</div>
      );
    },
  },
  {
    accessorKey: 'subcategory',
    header: () => <div className="text">Subkategori</div>,
    cell: ({ row }) => {
      const { product } = row.original;
      return (
        <div className="font-normal text-gray-500 flex items-center">
          {product.subcategory.name}
        </div>
      );
    },
  },
  {
    accessorKey: 'stock',
    header: () => <div className="text-left">Stok</div>,
    cell: ({ row }) => {
      return <div className="flex items-center">{row.getValue('stock')}</div>;
    },
  },
  {
    accessorKey: 'store',
    header: () => <div className="text-left">Toko</div>,
    cell: ({ row }) => {
      const { store } = row.original;
      return <div className="font-normal flex items-center">{store.name}</div>;
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="text-right pr-5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-2 hover:bg-gray-100 text-left rounded-lg">
                <DialogShowProductDetail data={user} />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export default function InventoryTable({ data }: { data: InventoryProps[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="rounded-md border">
      <ScrollArea className="w-[calc(100vw_-_32px)] md:w-full max-w-full rounded-md overflow-auto">
        <Table>
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
                <TableRow key={row.id}>
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
                  Inventaris tidak ditemukan.
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
