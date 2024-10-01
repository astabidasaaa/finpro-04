'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { CategoryProps } from '@/types/categoryTypes';
import { getCookie } from 'cookies-next';
import { useAppSelector } from '@/lib/hooks';
import { UserType } from '@/types/userType';
import DisabledButton from '@/components/DisabledButton';

export function DialogDeleteCategory({ data }: { data: CategoryProps }) {
  const token = getCookie('access-token');
  const { user } = useAppSelector((state) => state.auth);

  async function handleDelete() {
    try {
      const response = await axiosInstance().delete(`/categories/${data.id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        toast({
          variant: 'success',
          title: response.data.message,
        });
      }

      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      if (err instanceof AxiosError) {
        toast({
          variant: 'destructive',
          title: 'Kategori tidak dihapus',
          description: err.response?.data.message,
        });
      } else {
        alert(err);
      }
    }
  }

  return (
    <>
      {user.role === UserType.SUPERADMIN ? (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="w-full text-left">
              <span className="text-sm w-full">Hapus</span>
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Apakah kamu yakin untuk menghapus kategori {data.name}?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Tindakan ini tidak dapat dibatalkan. Ini akan secara permanen
                menghapus data kategori dari server kami.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <DisabledButton text={'Hapus'} />
      )}
    </>
  );
}

export function DialogEditCategory({ data }: { data: CategoryProps }) {
  const [name, setName] = useState<string>(data.name);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const token = getCookie('access-token');
  const { user } = useAppSelector((state) => state.auth);

  async function handleOnClick() {
    try {
      const response = await axiosInstance().patch(
        `/categories/${data.id}`,
        {
          name: name,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setIsOpen(false);
      if (response.status === 200) {
        toast({
          variant: 'success',
          title: response.data.message,
        });
      }

      setTimeout(() => {
        window.location.reload();
      }, 500);
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
          title: 'Perubahan tidak disimpan',
          description: message,
        });
      }, 300);
    }
  }

  useEffect(() => {
    setName(data.name);
  }, [isOpen]);

  return (
    <>
      {user.role === UserType.SUPERADMIN ? (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button className="w-full text-left">
              <span className="text-sm w-full">Ubah</span>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Ubah kategori</DialogTitle>
              <div />
              <DialogDescription>
                Ubah detail kategori Anda disini. Klik simpan perubahan saat
                Anda selesai.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nama
                </Label>
                <Input
                  id="name"
                  defaultValue={data.name}
                  className="col-span-3"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleOnClick}>
                Simpan perubahan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <DisabledButton text={'Ubah'} />
      )}
    </>
  );
}
