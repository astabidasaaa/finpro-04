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
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DialogDeleteProduct, DialogEditProduct } from './ActionProductButton';
import { ProductProps } from '@/types/productTypes';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

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
    accessorKey: 'productState',
    header: () => <div className="text">Status</div>,
    cell: ({ row }) => {
      const { productState } = row.original;
      return (
        <div className="font-normal flex items-center">
          {productState == 'PUBLISHED' ? (
            <Badge className="bg-green-400">PUBLISHED</Badge>
          ) : (
            <Badge className="bg-red-900">ARCHIVED</Badge>
          )}
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
          {product.brand.name}
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
          {product.prices[0].price}
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
                {/* <DialogEditProduct data={category} /> */}
              </div>
              <div className="p-2 hover:bg-gray-100 text-left rounded-lg">
                <DialogDeleteProduct data={product} />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
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
  const [expandedRow, setExpandedRow] = React.useState<string | null>(null);
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

  const handleRowClick = (rowId: string) => {
    setExpandedRow(expandedRow === rowId ? null : rowId);
  };

  return (
    <div className="rounded-md border">
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
              <React.Fragment key={row.id}>
                <TableRow
                  onClick={() => handleRowClick(row.id)}
                  className="cursor-pointer"
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
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
