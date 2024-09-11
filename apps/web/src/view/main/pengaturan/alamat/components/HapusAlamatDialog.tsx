import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getCookie } from 'cookies-next';
import axiosInstance from '@/lib/axiosInstance';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const HapusAlamatDialog = ({
  addressId,
  label,
  refetch,
}: {
  addressId: number;
  label: string;
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<AxiosResponse<any, any>, Error>>;
}) => {
  const token = getCookie('access-token');

  const [open, setOpen] = useState<boolean>(false);
  const [isSubmitLoading, setSubmitLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setSubmitLoading((prev) => true);

    try {
      const res = await axiosInstance().delete(
        `/user/addresses/${addressId}`,

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
            description: 'Berhasil menghapus alamat',
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
          title: 'Gagal menghapus alamat',
          description: message,
        });

        setSubmitLoading((prev) => false);
      }, 1500);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="p-0 h-max text-main-dark text-xs">
          Hapus
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hapus Alamat</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin untuk menghapus alamat dengan label <b>{label}</b>
            ? Alamat akan dihapus dari sistem dan tidak dapat dikembalikan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="mt-2 sm:mt-0 min-w-28"
          >
            Batal
          </Button>
          <Button
            type="button"
            className="min-w-36"
            onClick={handleSubmit}
            disabled={isSubmitLoading}
          >
            {isSubmitLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              'Hapus Alamat'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HapusAlamatDialog;
