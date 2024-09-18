import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import CreatePromotionForm from './CreateFormPromotion';
import { StoreProps } from '@/types/storeTypes';

export default function AddStorePromotion({
  stores,
}: {
  stores: StoreProps[];
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Promosi
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Promosi Umum</DialogTitle>
          <div />
          <DialogDescription>
            Promosi umum akan membagikan kupon kepada kustomer yang memenuhi
            ketentuan promosi. Buat promosi umum anda disini.
          </DialogDescription>
        </DialogHeader>
        <CreatePromotionForm setIsOpen={setIsOpen} stores={stores} />
      </DialogContent>
    </Dialog>
  );
}
