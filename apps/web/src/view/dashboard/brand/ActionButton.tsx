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
import { BrandProps } from '@/types/brandTypes';
import { AxiosError } from 'axios';
import { useState } from 'react';
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

export function DialogDeleteBrand({ data }: { data: BrandProps }) {
  async function handleDelete() {
    try {
      const response = await axiosInstance().delete(`/brands/${data.id}`);
      if (response.status == 200) {
        window.location.reload();
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast({
          variant: 'destructive',
          title: 'Brand tidak dihapus',
          description: err.response?.data.message,
        });
      } else {
        alert(err);
      }
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
            Apakah kamu yakin untuk menghapus brand {data.name}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Ini akan secara permanen
            menghapus data brand dari server kami.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function DialogEditBrand({ data }: { data: BrandProps }) {
  const [name, setName] = useState<string>(data.name);
  const [description, setDescription] = useState<string | undefined>(
    data.description,
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);

  async function handleOnClick() {
    try {
      const response = await axiosInstance().patch(`/brands/${data.id}`, {
        name: name,
        description: description,
      });

      setIsOpen(false);
      if (response.status == 200) {
        window.location.reload();
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast({
          variant: 'destructive',
          title: 'Perubahan tidak disimpan',
          description: err.response?.data.message,
        });
      } else {
        alert(err);
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="w-full text-left">
          <span className="text-sm w-full">Ubah</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ubah brand</DialogTitle>
          <div />
          <DialogDescription>
            Ubah detail brand Anda disini. Klik simpan perubahan saat Anda
            selesai.
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Deskripsi
            </Label>
            <Input
              id="username"
              defaultValue={data.description}
              className="col-span-3"
              onChange={(e) => setDescription(e.target.value)}
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
  );
}
