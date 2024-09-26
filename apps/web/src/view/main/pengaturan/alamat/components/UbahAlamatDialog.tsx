import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import AlamatForm from './AlamatForm';
import { Address } from '@/types/addressType';

const UbahAlamatDialog = ({
  fullAddress,
  refetch,
}: {
  fullAddress: Address;
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<AxiosResponse<any, any>, Error>>;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="p-0 h-max text-main-dark text-xs">
          Ubah Alamat
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ubah Alamat</DialogTitle>
          <DialogDescription>Pastikan alamat Anda benar</DialogDescription>
        </DialogHeader>
        <AlamatForm
          refetch={refetch}
          open={open}
          setOpen={setOpen}
          defaultAlamat={fullAddress}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UbahAlamatDialog;
