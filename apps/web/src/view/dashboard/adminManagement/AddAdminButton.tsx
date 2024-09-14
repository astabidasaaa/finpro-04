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
import RegisterFormAdmin from './RegisterAdmin';
import { StoreProps } from '@/types/storeTypes';
import axiosInstance from '@/lib/axiosInstance';
import { AxiosError } from 'axios';
import { getCookie } from 'cookies-next';

export function AddAdminButton() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [stores, setStores] = useState<StoreProps[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const token = getCookie('access-token');

  async function fetchData() {
    try {
      const storeResult = await axiosInstance().get(
        `${process.env.API_URL}/stores`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setStores(storeResult.data.data);

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
          Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Admin</DialogTitle>
          <div />
          <DialogDescription>
            Tambah akun admin toko atau super admin disini. Klik register admin
            saat Anda selesai.
          </DialogDescription>
        </DialogHeader>
        <RegisterFormAdmin setIsOpen={setIsOpen} stores={stores} />
      </DialogContent>
    </Dialog>
  );
}
