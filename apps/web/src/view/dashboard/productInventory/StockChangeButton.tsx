import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import RegisterFormInventory from './RegisterFormInventory';
import { StoreProps } from '@/types/storeTypes';
import axiosInstance from '@/lib/axiosInstance';
import { AxiosError } from 'axios';
import { getCookie } from 'cookies-next';

export function StockChangeButton({ stores }: { stores: StoreProps[] }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [products, setProducts] = useState<{ id: number; name: string }[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const token = getCookie('access-token');

  async function fetchData() {
    try {
      const productResult = await axiosInstance().get(
        `${process.env.API_URL}/products/all-brief`,
      );
      setProducts(productResult.data.data);

      setIsMounted(true);
    } catch (err) {
      if (err instanceof AxiosError) {
        alert(err.response?.data.message);
      } else {
        alert('Data is not fetched');
      }
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Entri Inventaris
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Entri Inventaris</DialogTitle>
          <div />
          <DialogDescription>
            Buat entri perubahan stok produk anda disini. Klik tambah entri saat
            Anda selesai.
          </DialogDescription>
        </DialogHeader>
        <RegisterFormInventory
          setIsOpen={setIsOpen}
          stores={stores}
          products={products}
        />
      </DialogContent>
    </Dialog>
  );
}
