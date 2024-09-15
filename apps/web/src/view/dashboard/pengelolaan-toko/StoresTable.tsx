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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button, buttonVariants } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';

const StoresTable = ({
  stores,
}: {
  stores: {
    name: string;
    address: string;
    storeState: string;
    createdAt: string;
  }[];
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[240px]">Nama Toko</TableHead>
          <TableHead className="hidden md:table-cell">Alamat</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="hidden sm:table-cell">Dibuat pada</TableHead>
          <TableHead>
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
                <TableCell className="w-[240px] font-medium">
                  {store.name}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {store.address}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      store.storeState === 'PUBLISHED'
                        ? 'default'
                        : store.storeState === 'DRAFT'
                          ? 'outline'
                          : 'secondary'
                    }
                    className={`text-[10px] ${store.storeState === 'PUBLISHED' && 'bg-emerald-500 hover:bg-emerald-500/80'}`}
                  >
                    {store.storeState}
                  </Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {createdDate}
                </TableCell>
                <TableCell>
                  <TableCell>
                    <AlertDialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu aksi</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                          // onClick={() => {
                          //   router.push(`/dashboard/events/${event.id}`);
                          // }}
                          >
                            Edit
                          </DropdownMenuItem>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem>Hapus</DropdownMenuItem>
                          </AlertDialogTrigger>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Apakah Anda yakin untuk menghapus toko {store.name}?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Tindakan ini
                            akan menghapus toko tersebut secara permanen dari
                            server.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batalkan</AlertDialogCancel>
                          <AlertDialogAction
                            className={buttonVariants({
                              variant: 'destructive',
                            })}
                          >
                            Hapus Toko
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
};

export default StoresTable;
