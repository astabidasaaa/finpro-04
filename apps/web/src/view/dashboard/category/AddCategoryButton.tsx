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
import { Plus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { getCookie } from 'cookies-next';

export default function AddCategoryButton() {
  const [name, setName] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const token = getCookie('access-token');

  async function handleOnClick() {
    try {
      const response = await axiosInstance().post(
        `/categories/`,
        {
          name: name,
          subcategories: [],
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
          title: 'Kategori gagal dibuat',
          description: message,
        });
      }, 300);
    }
  }

  useEffect(() => {
    setName('');
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Kategori
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah kategori</DialogTitle>
          <div />
          <DialogDescription>
            Buat kategori Anda di sini. Klik tambahkan saat Anda selesai.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nama
            </Label>
            <Input
              id="name"
              defaultValue={name}
              className="col-span-3"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleOnClick}>
            Tambahkan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
