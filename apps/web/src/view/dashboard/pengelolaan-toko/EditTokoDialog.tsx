'use client';

import React, { useState } from 'react';
import { Edit } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import TambahTokoForm from './TambahTokoForm';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { TStoreManagement, TStoreManagementData } from '@/types/storeTypes';

const EditTokoDialog = ({
  store,
  refetch,
}: {
  store: TStoreManagement;
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<TStoreManagementData, Error>>;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger>
              <Edit className="size-4 text-muted-foreground" />
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit Toko</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="sm:max-w-[425px] lg:!max-w-[560px] px-0">
        <DialogHeader className="px-4 md:px-6">
          <DialogTitle>Edit Toko</DialogTitle>
          <DialogDescription>Pastikan informasi toko benar</DialogDescription>
        </DialogHeader>
        <TambahTokoForm
          refetch={refetch}
          open={open}
          setOpen={setOpen}
          defaultToko={store}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditTokoDialog;
