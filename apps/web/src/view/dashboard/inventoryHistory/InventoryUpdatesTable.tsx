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
  InventoryUpdateProps,
  InventoryUpdateType,
  UpdateDetail,
  UpdateType,
} from '@/types/inventoryType';
import moment from 'moment';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DialogShowInventoryUpdateDetail } from './ActionButton';

export const columns: ColumnDef<InventoryUpdateProps>[] = [
  {
    accessorKey: 'produk',
    header: () => <div className="text">Produk</div>,
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
    accessorKey: 'toko',
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
          <Badge className="bg-gray-600 px-3 font-normal text-center">
            {updateDetailMap.get(detail)?.toUpperCase()}
          </Badge>
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
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const inventoryUpdate = row.original;

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
                <DialogShowInventoryUpdateDetail data={inventoryUpdate} />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export default function InventoryTable({
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
    <div className="pt-4">
      <div className="mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Pilih Kolom <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <ScrollArea className="w-[calc(100vw_-_32px)] md:w-[66vw] lg:w-full max-w-full rounded-md overflow-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
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
                    Riwayat inventaris tidak ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
