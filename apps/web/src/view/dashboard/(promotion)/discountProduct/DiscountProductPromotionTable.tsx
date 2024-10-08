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
import { ProductDiscountPromotionProps } from '@/types/promotionType';
import moment from 'moment';
import { DiscountType, State } from '@/types/productTypes';
import ArchiveAlertButton from '../components/ArchivedAlertButton';
import PublishAlertButton from '../components/PublishedAlertButton';

export const columns: ColumnDef<ProductDiscountPromotionProps>[] = [
  {
    accessorKey: 'name',
    header: () => <div className="text">Nama Produk</div>,
    cell: ({ row }) => {
      const { inventory } = row.original;
      return (
        <div className="font-medium flex items-center md:[overflow-wrap:anywhere]">
          {inventory.product.name}
        </div>
      );
    },
  },
  {
    accessorKey: 'store',
    header: () => <div className="text">Toko</div>,
    cell: ({ row }) => {
      const { inventory } = row.original;
      return (
        <div className="font-normal text-gray-500 flex items-center">
          {inventory.store.name}
        </div>
      );
    },
  },
  {
    accessorKey: 'discount',
    header: () => <div className="text-left">Diskon</div>,
    cell: ({ row }) => {
      const { discountValue, discountType } = row.original;
      return (
        <div className="font-normal flex items-center">
          {discountValue} {discountType === DiscountType.PERCENT ? '%' : ''}
        </div>
      );
    },
  },

  {
    accessorKey: 'startedAt',
    header: () => <div className="text-left">Waktu Mulai</div>,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          {moment(row.getValue('startedAt')).format('ll')}
        </div>
      );
    },
  },
  {
    accessorKey: 'finishedAt',
    header: () => <div className="text-left">Waktu Selesai</div>,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          {moment(row.getValue('finishedAt')).format('ll')}
        </div>
      );
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const promotion = row.original;

      return (
        <div className="flex space-x-2">
          {promotion.productDiscountState === State.DRAFT && (
            <PublishAlertButton
              promotion={{
                id: promotion.id,
                name: promotion.inventory.product.name,
              }}
              type="DISCOUNTPRODUCT"
            />
          )}
          {(promotion.productDiscountState === State.DRAFT ||
            promotion.productDiscountState === State.PUBLISHED) && (
            <ArchiveAlertButton
              promotion={{
                id: promotion.id,
                name: promotion.inventory.product.name,
              }}
              type="DISCOUNTPRODUCT"
            />
          )}
        </div>
      );
    },
  },
];

export default function FreeProductPromotionTable({
  data,
}: {
  data: ProductDiscountPromotionProps[];
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
                  Promosi tidak ditemukan.
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
