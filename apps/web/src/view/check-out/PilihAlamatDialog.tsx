import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ChevronRight } from 'lucide-react';
import { Address } from '@/types/addressType';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import TambahAlamatDialog from '../main/pengaturan/alamat/components/TambahAlamatDialog';
import { Badge } from '@/components/ui/badge';
import PilihAlamatDialogContent from './PilihAlamatDialogContent';

type Props = {
  addresses: Address[] | null;
  setAddresses: React.Dispatch<React.SetStateAction<Address[] | null>>;
  selectedAddressId: string;
  setSelectedAddressId: React.Dispatch<React.SetStateAction<string>>;
  selectedAddress: Address | null;
  refetchSelectedAddress: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<any, Error>>;
};

const PilihAlamatDialog = ({
  addresses,
  setAddresses,
  selectedAddressId,
  setSelectedAddressId,
  selectedAddress,
  refetchSelectedAddress,
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  //   const [addresses, setAddresses] = useState<Address[] | null>(null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex flex-row justify-between items-center w-full hover:cursor-pointer">
          <div className="flex flex-col justify-start items-start">
            {selectedAddress ? (
              <>
                <p className="font-bold text-xs md:text-sm">
                  {selectedAddress.isMain && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] text-muted-foreground font-bold tracking-wide w-max mr-2"
                    >
                      Utama
                    </Badge>
                  )}{' '}
                  {selectedAddress.name}
                </p>
                <p className="text-muted-foreground text-xs md:text-sm">
                  {selectedAddress.address}
                </p>
              </>
            ) : (
              <p className="text-muted-foreground text-xs md:text-sm">
                Anda belum memiliki alamat. Klik untuk menambah alamat.
              </p>
            )}
          </div>
          <ChevronRight />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:!max-w-[640px]">
        <DialogHeader>
          <DialogTitle>Pilih Alamat</DialogTitle>
          <DialogDescription className="sr-only">
            Pilih alamat pengiriman Anda
          </DialogDescription>
        </DialogHeader>
        <PilihAlamatDialogContent
          addresses={addresses}
          setAddresses={setAddresses}
          selectedAddressId={selectedAddressId}
          setSelectedAddressId={setSelectedAddressId}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PilihAlamatDialog;
