import React, { useEffect, useState } from 'react';
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
import { Loader2, MapPin, MapPinOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from '@/components/ui/use-toast';
import { Address, TLocation } from '@/types/addressType';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import PinPoint from './PinPoint';

type TForm = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<AxiosResponse<any, any>, Error>>;
  defaultAlamat: Address | null;
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
  latitude: z.number().refine((val) => val !== 0, {
    message: 'Pinpoint wajib diisi',
  }),
  longitude: z.number().refine((val) => val !== 0, {
    message: 'Pinpoint wajib diisi',
  }),
});

const AlamatForm = ({ refetch, open, setOpen, defaultAlamat }: TForm) => {
  const token = getCookie('access-token');

  const [isSubmitLoading, setSubmitLoading] = useState<boolean>(false);

  const [dialogPage, setDialogPage] = useState<string>('address_main');

  const [mapPin, setMapPin] = useState<TLocation | null>(() => {
    if (defaultAlamat) {
      return {
        lat: parseFloat(defaultAlamat.latitude),
        lng: parseFloat(defaultAlamat.longitude),
      };
    }

    return null;
  });

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setDialogPage('address_main');
      }, 500);
    }
  }, [open]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultAlamat?.name || '',
      address: defaultAlamat?.address || '',
      zipCode: defaultAlamat?.zipCode.toString() || '',
      latitude: defaultAlamat ? parseFloat(defaultAlamat.latitude) : 0,
      longitude: defaultAlamat ? parseFloat(defaultAlamat.longitude) : 0,
    },
  });

  useEffect(() => {
    if (mapPin?.lat && mapPin?.lng) {
      form.setValue('latitude', mapPin.lat);
      form.setValue('longitude', mapPin.lng);

      form.trigger('latitude');
      form.trigger('longitude');
    }
  }, [mapPin]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitLoading((prev) => true);

    try {
      if (defaultAlamat) {
        const res = await axiosInstance().patch(
          `/user/addresses/${defaultAlamat.id}`,
          {
            name: values.name,
            address: values.address,
            zipCode: values.zipCode,
            latitude: values.latitude,
            longitude: values.longitude,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setTimeout(() => {
          setSubmitLoading((prev) => false);

          if (res.status === 200) {
            setOpen((prev) => false);
            refetch();

            toast({
              variant: 'default',
              title: res.data.message,
              description: 'Alamat berhasil diubah',
            });
          }
        }, 1500);
      } else {
        const res = await axiosInstance().post(
          '/user/addresses',
          {
            name: values.name,
            address: values.address,
            zipCode: values.zipCode,
            latitude: values.latitude,
            longitude: values.longitude,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setTimeout(() => {
          setSubmitLoading((prev) => false);

          if (res.status === 201) {
            setOpen((prev) => false);
            refetch();

            toast({
              variant: 'default',
              title: res.data.message,
              description: 'Alamat berhasil ditambah',
            });
          }
        }, 1500);
      }
    } catch (error: any) {
      console.log(error);
      let message = '';
      if (error instanceof AxiosError) {
        message = error.response?.data.message;
      } else {
        message = error.message;
      }

      setTimeout(() => {
        toast({
          variant: 'destructive',
          title: 'Gagal mengupdate alamat',
          description: message,
        });

        setSubmitLoading((prev) => false);
      }, 1500);
    }
  };

  if (dialogPage !== 'address_main') {
    return (
      <PinPoint
        key="address_map"
        setDialogPage={setDialogPage}
        mapPin={mapPin}
        setMapPin={setMapPin}
      />
    );
  }

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
        <FormField
          control={form.control}
          name="latitude"
          render={({ field }: { field: any }) => (
            <FormItem className="hidden grid-cols-4 items-center gap-x-4">
              <FormLabel className="text-right">Latitude</FormLabel>
              <FormControl>
                <Input {...field} type="hidden" className="col-span-3 !mt-0" />
              </FormControl>
              <FormMessage className="col-start-2  col-span-3 text-center md:text-start" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="latitude"
          render={({ field }: { field: any }) => (
            <FormItem className="flex flex-col items-start gap-x-4 w-full">
              <div className="flex justify-between items-center w-full rounded-md border px-3 py-3 text-sm !mt-0">
                <FormLabel className="col-span-3 flex flex-row gap-2 items-center">
                  {mapPin ? (
                    <>
                      <MapPin className="size-4 text-green-500" />
                      <span className="text-green-500">Ubah Pinpoint</span>
                    </>
                  ) : (
                    <>
                      <MapPinOff className="size-4" />
                      Tambah Pinpoint
                    </>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="hidden"
                    className="col-span-3 !mt-0"
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="link"
                  className="p-0 text-main-dark h-max"
                  onClick={() => {
                    setDialogPage('address_map');
                  }}
                >
                  {mapPin ? 'Atur Ulang' : 'Atur'}
                </Button>
              </div>
              <FormMessage className="col-start-2  col-span-3 text-center md:text-start" />
            </FormItem>
          )}
        />
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

export default AlamatForm;
