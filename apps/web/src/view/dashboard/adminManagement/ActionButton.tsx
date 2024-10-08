'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import axiosInstance from '@/lib/axiosInstance';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
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
import { toast } from '@/components/ui/use-toast';
import { SearchedUser } from '@/types/userType';
import { getCookie } from 'cookies-next';
import { StoreProps } from '@/types/storeTypes';
import EditFormAdmin from './EditAdmin';

export function DialogDeleteAdmin({ data }: { data: SearchedUser }) {
  const token = getCookie('access-token');

  async function handleDelete() {
    try {
      const response = await axiosInstance().patch(
        `/admins/delete/${data.id}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status == 200) {
        window.location.reload();
      }
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
          title: 'Akun gagal dihapus',
          description: message,
        });
      }, 300);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="w-full text-left">
          <span className="text-sm w-full">Hapus</span>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Apakah kamu yakin untuk menghapus admin {data.email}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Akun ini tidak akan dapat
            digunakan kembali.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            Lanjutkan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function DialogEditAdmin({ data }: { data: SearchedUser }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [stores, setStores] = useState<StoreProps[]>([]);
  const token = getCookie('access-token');

  async function fetchData() {
    const storeResult = await axiosInstance().get(
      `${process.env.API_URL}/stores/admin`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    setStores(storeResult.data.data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="w-full text-left">
          <span className="text-sm w-full">Ubah informasi akun</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ubah akun</DialogTitle>
          <div />
          <DialogDescription>
            Ubah detail akun Anda disini. Klik simpan perubahan saat Anda
            selesai.
          </DialogDescription>
        </DialogHeader>
        <EditFormAdmin stores={stores} setIsOpen={setIsOpen} user={data} />
      </DialogContent>
    </Dialog>
  );
}
