'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import TambahTokoForm from './TambahTokoForm';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { TStoreManagementData } from '@/types/storeTypes';

const TambahTokoDialog = ({
  refetch,
}: {
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<TStoreManagementData, Error>>;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="bg-main-dark hover:bg-main-dark/80"
        >
          <Plus className="size-4 mr-0 md:mr-2" />
          <span className="hidden md:inline-block">Tambah Toko</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] lg:!max-w-[560px] px-0">
        <DialogHeader className="px-4 md:px-6">
          <DialogTitle>Tambah Toko</DialogTitle>
          <DialogDescription>Pastikan informasi toko benar</DialogDescription>
        </DialogHeader>
        <TambahTokoForm refetch={refetch} open={open} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default TambahTokoDialog;
