import React, { useState } from 'react';
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TStoreManagement, TStoreManagementData } from '@/types/storeTypes';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { buttonVariants } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { getCookie } from 'cookies-next';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from '@/components/ui/use-toast';
import { AxiosError } from 'axios';

const DeleteTokoDialog = ({
  store,
  refetch,
}: {
  store: TStoreManagement;
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<TStoreManagementData, Error>>;
}) => {
  const token = getCookie('access-token');

  const [open, setOpen] = useState<boolean>(false);
  const [isSubmitLoading, setSubmitLoading] = useState<boolean>(false);

  const handleDelete = async () => {
    try {
      const res = await axiosInstance().delete(
        `/store-management/${store.id}`,

        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setTimeout(() => {
        setSubmitLoading((prev) => false);

        if (res.status === 200) {
          setOpen((prev) => false);
          refetch();

          toast({
            variant: 'default',
            title: res.data.message,
            description: 'Toko berhasil dihapus',
          });
        }
      }, 1500);
    } catch (error: any) {
      let message = '';
      if (error instanceof AxiosError) {
        message = error.response?.data.message;
      } else {
        message = error.message;
      }

      setTimeout(() => {
        toast({
          variant: 'destructive',
          title: 'Gagal menghapus toko',
          description: message,
        });

        setSubmitLoading((prev) => false);
      }, 1500);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger>
              <Trash className="size-4 text-muted-foreground" />
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Hapus Toko</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Apakah Anda yakin untuk menghapus toko {store.name}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Tindakan ini akan menghapus
            toko tersebut secara permanen dari server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batalkan</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({
              variant: 'destructive',
            })}
            onClick={handleDelete}
            disabled={isSubmitLoading}
          >
            Hapus Toko
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTokoDialog;
