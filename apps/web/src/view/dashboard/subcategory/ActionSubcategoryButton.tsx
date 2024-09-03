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
import { SubcategoryProps } from '@/types/subcategoryTypes';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CategoryProps } from '@/types/categoryTypes';

export function DialogDeleteCategory({ data }: { data: SubcategoryProps }) {
  async function handleDelete() {
    try {
      const response = await axiosInstance().delete(
        `/subcategories/${data.id}`,
      );
      if (response.status == 200) {
        window.location.reload();
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast({
          variant: 'destructive',
          title: 'Subkategori tidak dihapus',
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
            Apakah kamu yakin untuk menghapus subkategori {data.name}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Ini akan secara permanen
            menghapus data subkategori dari server kami.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Hapus</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function DialogEditSubcategory({ data }: { data: SubcategoryProps }) {
  const [name, setName] = useState<string>(data.name);
  const [parentCategoryId, setParentCategoryId] = useState<string>(
    String(data.productCategoryId),
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [categories, setCategories] = useState<CategoryProps[]>([]);

  async function fetchCategories() {
    const categoriesResult = await axiosInstance().get(
      `${process.env.API_URL}/categories`,
    );

    setCategories(categoriesResult.data.data);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  async function handleOnClick() {
    try {
      const response = await axiosInstance().patch(
        `/subcategories/${data.id}`,
        {
          name: name,
          parentCategoryId,
        },
      );

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
          <DialogTitle>Ubah subkategori</DialogTitle>
          <div />
          <DialogDescription>
            Ubah detail subkategori Anda disini. Klik simpan perubahan saat Anda
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
            <Label htmlFor="name" className="text-right">
              Kategori
            </Label>
            <Select onValueChange={(e) => setParentCategoryId(e)}>
              <SelectTrigger className="col-span-3">
                <SelectValue
                  placeholder={
                    data.productCategoryId
                      ? categories.find(
                          (cat) => cat.id == data.productCategoryId,
                        )?.name
                      : 'Select a category'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
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
