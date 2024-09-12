import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import AlamatForm from './AlamatForm';

const TambahAlamatDialog = ({
  refetch,
}: {
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<AxiosResponse<any, any>, Error>>;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-main-dark hover:bg-main-dark/80">
          <Plus className="size-4 mr-0 md:mr-2" />
          <span className="hidden md:inline-block">Tambah Alamat</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Alamat</DialogTitle>
          <DialogDescription>Pastikan alamat Anda benar</DialogDescription>
        </DialogHeader>
        <AlamatForm
          refetch={refetch}
          open={open}
          setOpen={setOpen}
          defaultAlamat={null}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TambahAlamatDialog;
