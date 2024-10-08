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
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import axiosInstance from '@/lib/axiosInstance';
import { useAppSelector } from '@/lib/hooks';
import { ProductProps } from '@/types/productTypes';
import { UserType } from '@/types/userType';
import { AxiosError } from 'axios';
import { getCookie } from 'cookies-next';
import { Trash2 } from 'lucide-react';

export default function ArchiveAlertButton({
  product,
}: {
  product: ProductProps;
}) {
  const token = getCookie('access-token');
  const { user } = useAppSelector((state) => state.auth);

  async function handleDelete() {
    try {
      const response = await axiosInstance().patch(
        `/products/archive/${product.id}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
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
          title: 'Produk gagal diarsip',
          description: message,
        });
      }, 300);
    }
  }

  return (
    <>
      {user.role === UserType.SUPERADMIN && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="h-8 w-8 p-0">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Apakah kamu yakin untuk mengarsip produk {product.name}?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Tindakan ini akan membuat produk tidak dapat dibeli.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Arsip
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
