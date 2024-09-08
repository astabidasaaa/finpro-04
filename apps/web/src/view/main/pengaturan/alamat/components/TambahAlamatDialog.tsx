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
import { TLocation } from '@/types/addressType';
import { getCookie } from 'cookies-next';
import { z } from 'zod';
import { AxiosError, AxiosResponse } from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from '@/components/ui/use-toast';
import TambahAlamatForm from './TambahAlamatForm';
import PinPoint from './PinPoint';

const TambahAlamatDialog = ({
  refetch,
}: {
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<AxiosResponse<any, any>, Error>>;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [dialogPage, setDialogPage] = useState<string>('address_main');
  const [mapPin, setMapPin] = useState<TLocation>({
    lat: -6.2,
    lng: 106.816666,
  });

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
        {dialogPage === 'address_main' ? (
          <TambahAlamatForm
            refetch={refetch}
            setOpen={setOpen}
            mapPin={mapPin}
            setDialogPage={setDialogPage}
          />
        ) : (
          <PinPoint
            key="address_map"
            setDialogPage={setDialogPage}
            mapPin={mapPin}
            setMapPin={setMapPin}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TambahAlamatDialog;
