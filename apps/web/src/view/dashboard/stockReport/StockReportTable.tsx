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
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ProductStockChange } from '@/types/salesType';
import DetailStockDialog from './DetailStockDialog';

export const columns: ColumnDef<ProductStockChange>[] = [
  {
    accessorKey: 'name',
    header: () => <div className="text">Nama Produk</div>,
    cell: ({ row }) => (
      <div className="font-medium flex items-center [overflow-wrap:anywhere]">
        {row.getValue('name')}
      </div>
    ),
  },
  {
    accessorKey: 'totalAdd',
    header: () => <div className="text">Jumlah Penambahan</div>,
    cell: ({ row }) => (
      <div className="font-normal flex items-center">
        {row.getValue('totalAdd')}
      </div>
    ),
  },
  {
    accessorKey: 'totalRemove',
    header: () => <div className="text">Jumlah Pengurangan</div>,
    cell: ({ row }) => (
      <div className="font-normal flex items-center">
        {row.getValue('totalRemove')}
      </div>
    ),
  },
  {
    accessorKey: 'lastStock',
    header: () => <div className="text">Stok</div>,
    cell: ({ row }) => (
      <div className="font-normal flex items-center">
        {row.getValue('lastStock')}
      </div>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="flex space-x-2">
          <DetailStockDialog product={product} />
        </div>
      );
    },
  },
];

export default function StockReportTable({
  data,
}: {
  data: ProductStockChange[];
}) {
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
                  Laporan stok tidak ditemukan.
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
