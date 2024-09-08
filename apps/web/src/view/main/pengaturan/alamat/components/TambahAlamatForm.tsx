import React, { useState } from 'react';
import { getCookie } from 'cookies-next';
import { DialogFooter } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2, MapPinOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from '@/components/ui/use-toast';
import { TLocation } from '@/types/addressType';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';

type TForm = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mapPin: TLocation;
  setDialogPage: React.Dispatch<React.SetStateAction<string>>;
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<AxiosResponse<any, any>, Error>>;
};

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Label alamat wajib diisi' })
    .max(32, { message: 'Label alamat maksimal berisi 32 karakter' }),
  address: z
    .string()
    .trim()
    .min(1, 'Alamat wajib diisi')
    .max(80, 'Alamat maksimal berisi 80 karakter'),
  zipCode: z
    .string()
    .trim()
    .regex(/^\d+$/, 'Kode pos hanya bisa diisi angka')
    .min(1, 'Kode pos wajib diisi')
    .max(8, 'Kode pos berisi maksimal 8 angka'),
  latitude: z.number().min(1).max(12),
  longitude: z.number().min(1).max(12),
});

const TambahAlamatForm = ({
  refetch,
  setOpen,
  mapPin,
  setDialogPage,
}: TForm) => {
  const token = getCookie('access-token');
  const [isSubmitLoading, setSubmitLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      address: '',
      zipCode: '',
      latitude: 0,
      longitude: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitLoading((prev) => true);

    try {
      //   const res = await axiosInstance().post(
      //     '/user/addresses',
      //     {
      //       name: values.name,
      //       address: values.address,
      //       zipCode: values.zipCode,
      //       latitude: values.latitude,
      //       longitude: values.longitude,
      //     },
      //     {
      //       headers: {
      //         'Content-Type': 'application/json',
      //         Authorization: `Bearer ${token}`,
      //       },
      //     },
      //   );

      setTimeout(() => {
        setSubmitLoading((prev) => false);

        console.log(values);

        // if (res.status === 201) {
        //   setOpen((prev) => false);
        //   refetch();

        //   toast({
        //     variant: 'default',
        //     title: res.data.message,
        //     description: 'Alamat berhasil ditambah',
        //   });
        // }
      }, 1500);
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
          title: 'Tambah alamat gagal',
          description: message,
        });

        setSubmitLoading((prev) => false);
      }, 1500);
    }
  };

  return (
    <Form {...form} key="address_main">
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }: { field: any }) => (
            <FormItem className="grid grid-cols-4 items-center gap-x-4">
              <FormLabel className="text-right">Label Alamat</FormLabel>
              <FormControl>
                <Input {...field} className="col-span-3 !mt-0" />
              </FormControl>
              <FormMessage className="col-start-2  col-span-3 text-center md:text-start" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }: { field: any }) => (
            <FormItem className="grid grid-cols-4 items-center gap-x-4">
              <FormLabel className="text-right">Alamat Lengkap</FormLabel>
              <FormControl>
                <Input {...field} className="col-span-3 !mt-0" />
              </FormControl>
              <FormMessage className="col-start-2  col-span-3 text-center md:text-start" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="zipCode"
          render={({ field }: { field: any }) => (
            <FormItem className="grid grid-cols-4 items-center gap-x-4">
              <FormLabel className="text-right">Kode Pos</FormLabel>
              <FormControl>
                <Input {...field} className="col-span-3 !mt-0" />
              </FormControl>
              <FormMessage className="col-start-2  col-span-3 text-center md:text-start" />
            </FormItem>
          )}
        />
        <div className="flex justify-between items-center h-10 w-full rounded-md  bg-background px-3 py-2 text-sm !mt-0">
          <Label className="col-span-3 flex flex-row gap-2 items-center">
            <MapPinOff className="size-4" /> Tambah Pinpoint
          </Label>
          <Button
            type="button"
            variant="link"
            className="p-0 text-main-dark"
            onClick={() => {
              setDialogPage('address_map');
            }}
          >
            Atur
          </Button>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={isSubmitLoading} className="min-w-36">
            {isSubmitLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              'Simpan'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default TambahAlamatForm;
