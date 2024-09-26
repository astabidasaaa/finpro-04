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
import {
  InventoryProps,
  InventoryUpdateProps,
  InventoryUpdateType,
  UpdateDetail,
  UpdateType,
} from '@/types/inventoryType';
import { Badge } from '@/components/ui/badge';
import moment from 'moment';

export const columns: ColumnDef<InventoryUpdateProps>[] = [
  {
    accessorKey: 'perubahan stok',
    header: () => <div className="text-left">Perubahan Stok</div>,
    cell: ({ row }) => {
      const { stockChange } = row.original;
      return <div className="flex items-center">{stockChange}</div>;
    },
  },
  {
    accessorKey: 'tipe',
    header: () => <div className="text-left">Tipe</div>,
    cell: ({ row }) => {
      const update = row.original;
      return (
        <div className="font-normal flex items-center">
          {update.type === InventoryUpdateType.ADD ? (
            <Badge className="bg-green-400 px-3 font-semibold">
              {UpdateType.ADD.toUpperCase()}
            </Badge>
          ) : (
            <Badge className="bg-red-900 px-3 font-semibold">
              {UpdateType.REMOVE.toUpperCase()}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'detail',
    header: () => <div className="text-left">Detail</div>,
    cell: ({ row }) => {
      const { detail } = row.original;
      const updateDetailMap = new Map<string, string>(
        Object.entries(UpdateDetail),
      );
      return (
        <div className="font-normal flex items-center">
          {updateDetailMap.get(detail)?.toUpperCase()}
        </div>
      );
    },
  },
  {
    accessorKey: 'tanggal',
    header: () => <div className="text-left">Tanggal</div>,
    cell: ({ row }) => {
      const { createdAt } = row.original;
      return (
        <div className="font-normal flex items-center">
          {moment(createdAt).format('lll')}
        </div>
      );
    },
  },
];

export default function ProductStockReportTable({
  data,
}: {
  data: InventoryUpdateProps[];
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="rounded-md border">
      <ScrollArea className="w-[calc(100vw_-_32px)] md:w-full max-w-full rounded-md overflow-auto max-h-96">
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
        <ScrollBar orientation="vertical" />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
