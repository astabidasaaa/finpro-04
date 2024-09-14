'use client';

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
import axiosInstance from '@/lib/axiosInstance';
import { AxiosError } from 'axios';
import { getCookie } from 'cookies-next';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const DialogVerifikasi = ({ email }: { email: string }) => {
  const token = getCookie('access-token');

  const [isSubmitLoading, setSubmitLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const handleSubmit = async () => {
    setSubmitLoading((prev) => true);

    try {
      const res = await axiosInstance().get('/auth/verify-email-request', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      setTimeout(() => {
        setSubmitLoading((prev) => false);

        if (res.status === 200) {
          setOpen((prev) => false);

          toast({
            variant: 'default',
            title: res.data.message,
            description:
              'Silakan akses link verifikasi yang telah dikirimkan ke email Anda',
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
          title: 'Permintaan verifikasi email gagal',
          description: message,
        });

        setSubmitLoading((prev) => false);
      }, 1500);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Badge variant="destructive" className="hover:cursor-pointer">
          Belum diverifikasi
        </Badge>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Verifikasi email</DialogTitle>
          <DialogDescription>
            Tekan lanjutkan untuk memverifikasi. Kami akan mengirimkan pesan
            berisi link verifikasi ke {email}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            onClick={() => handleSubmit()}
            disabled={isSubmitLoading}
            className="min-w-36"
          >
            {isSubmitLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              'Lanjutkan'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogVerifikasi;
