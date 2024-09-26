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
import { State } from '@/types/productTypes';
import { AxiosError } from 'axios';
import { getCookie } from 'cookies-next';
import { Trash2 } from 'lucide-react';

export default function ArchiveAlertButton({
  promotion,
  type,
}: {
  promotion: { id: number; name: string };
  type: 'NONPRODUCT' | 'FREEPRODUCT' | 'DISCOUNTPRODUCT';
}) {
  const token = getCookie('access-token');

  async function handleDelete() {
    try {
      const response = await axiosInstance().patch(
        `/promotions/state/${type.toLowerCase()}/${promotion.id}`,
        { state: State.ARCHIVED },
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
    } catch (err) {
      if (err instanceof AxiosError) {
        toast({
          variant: 'destructive',
          title: 'Promosi tidak diarsip',
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
        <Button variant="outline" className="h-8 w-8 p-0">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Apakah kamu yakin untuk mengarsip promosi {promotion.name}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Ini akan membuat promosi anda
            inaktif.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Arsip</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
