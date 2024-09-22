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
import { ProductAndCategoryReport } from '@/types/salesType';
import { IDR } from '@/lib/utils';
export const columns: ColumnDef<ProductAndCategoryReport>[] = [
  {
    accessorKey: 'name',
    header: () => <div className="text">Kategori</div>,
    cell: ({ row }) => (
      <div className="font-medium flex items-center">
        {row.getValue('name')}
      </div>
    ),
  },
  {
    accessorKey: 'totalQty',
    header: () => <div className="text">Jumlah Barang</div>,
    cell: ({ row }) => (
      <div className="font-normal flex items-center">
        {row.getValue('totalQty')}
      </div>
    ),
  },
  {
    accessorKey: 'totalPrice',
    header: () => <div className="text">Penjualan</div>,
    cell: ({ row }) => (
      <div className="font-normal flex items-center">
        {IDR.format(row.getValue('totalPrice'))}
      </div>
    ),
  },
];

export default function CategoryReportTable({
  data,
}: {
  data: ProductAndCategoryReport[];
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="rounded-md border">
      <ScrollArea className="xl:max-h-[330px] rounded-md overflow-auto">
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
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
