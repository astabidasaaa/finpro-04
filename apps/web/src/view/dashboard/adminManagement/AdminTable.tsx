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
import { DialogDeleteAdmin, DialogEditAdmin } from './ActionButton';
import DialogChangePassword from './ChangePasswordAction';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export const columns: ColumnDef<SearchedUser>[] = [
  {
    accessorKey: 'email',
    header: () => <div className="text">Email</div>,
    cell: ({ row }) => {
      return (
        <div className="font-normal flex items-center">
          {row.getValue('email')}
        </div>
      );
    },
  },
  {
    accessorKey: 'name',
    header: () => <div className="text-left">Nama</div>,
    cell: ({ row }) => {
      const { profile } = row.original;
      return <div className="flex items-center">{profile?.name || '-'}</div>;
    },
  },
  {
    accessorKey: 'role',
    header: () => <div className="text-left">Tipe</div>,
    cell: ({ row }) => {
      const { role } = row.original;
      return (
        <div className="font-normal flex items-center">
          {role.name.toUpperCase()}
        </div>
      );
    },
  },
  {
    accessorKey: 'store',
    header: () => <div className="text-left">Toko</div>,
    cell: ({ row }) => {
      const { store } = row.original;
      return (
        <div className="font-normal flex items-center">
          {store?.name || '-'}
        </div>
      );
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
                <DialogEditAdmin data={user} />
              </div>
              <div className="p-2 hover:bg-gray-100 text-left rounded-lg">
                <DialogChangePassword data={user} />
              </div>
              <div className="p-2 hover:bg-gray-100 text-left rounded-lg">
                <DialogDeleteAdmin data={user} />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export default function AdminTable({ data }: { data: SearchedUser[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

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
    <div className="rounded-md border">
      <ScrollArea className="w-[calc(100vw_-_48px)] md:w-full max-w-full rounded-md overflow-auto">
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
                  Akun tidak ditemukan.
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
