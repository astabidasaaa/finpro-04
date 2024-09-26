'use client';

import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { getCookie } from 'cookies-next';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { TLocation } from '@/types/addressType';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TStoreManagement,
  TStoreManagementData,
  TUpdateStore,
} from '@/types/storeTypes';
import { toast } from '@/components/ui/use-toast';
import axiosInstance from '@/lib/axiosInstance';
import PinPoint from '@/view/main/pengaturan/alamat/components/PinPoint';
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
import { DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import AdminSelect from './AdminSelect';
import { formSchema } from './TokoFormSchema';

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<TStoreManagementData, Error>>;
  defaultToko?: TStoreManagement;
};

const TambahTokoForm = ({ refetch, open, setOpen, defaultToko }: Props) => {
  const token = getCookie('access-token');

  const [isSubmitLoading, setSubmitLoading] = useState<boolean>(false);

  const [dialogPage, setDialogPage] = useState<string>('address_main');

  const [mapPin, setMapPin] = useState<TLocation | null>(() => {
    if (defaultToko) {
      return {
        lat: parseFloat(defaultToko.addresses[0].latitude),
        lng: parseFloat(defaultToko.addresses[0].longitude),
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
      storeName: defaultToko?.name || '',
      storeState: defaultToko?.storeState || 'DRAFT',
      storeAddress: {
        address: defaultToko?.addresses[0].address || '',
        latitude: defaultToko?.addresses[0].latitude || '',
        longitude: defaultToko?.addresses[0].longitude || '',
      },
      storeAdmins:
        defaultToko?.admins.map((admin) => {
          return admin.id;
        }) || [],
    },
  });

  useEffect(() => {
    if (mapPin?.lat && mapPin?.lng) {
      form.setValue('storeAddress.latitude', mapPin.lat.toString());
      form.setValue('storeAddress.longitude', mapPin.lng.toString());

      form.trigger('storeAddress.latitude');
      form.trigger('storeAddress.longitude');
    }
  }, [mapPin]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitLoading((prev) => true);

    try {
      if (defaultToko) {
        const values = form.getValues();
        const { dirtyFields } = form.formState;

        const dirtyValues: TUpdateStore = {};

        if (dirtyFields.storeName) {
          dirtyValues.storeName = values.storeName;
        }

        if (dirtyFields.storeState) {
          dirtyValues.storeState = values.storeState;
        }

        if (dirtyFields.storeAddress) {
          dirtyValues.storeAddress = {};
          if (dirtyFields.storeAddress.address) {
            dirtyValues.storeAddress.address = values.storeAddress.address;
          }
          if (dirtyFields.storeAddress.latitude) {
            dirtyValues.storeAddress.latitude = values.storeAddress.latitude;
          }
          if (dirtyFields.storeAddress.longitude) {
            dirtyValues.storeAddress.longitude = values.storeAddress.longitude;
          }
        }

        if (dirtyFields.storeAdmins) {
          dirtyValues.storeAdmins = values.storeAdmins;
        }

        const res = await axiosInstance().patch(
          `/store-management/${defaultToko.id}`,
          dirtyValues,
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
              description: 'Toko berhasil diupdate',
            });
          }
        }, 1500);
      } else {
        const res = await axiosInstance().post(
          '/store-management',
          {
            storeName: values.storeName,
            storeState: values.storeState,
            storeAddress: {
              address: values.storeAddress.address,
              latitude: values.storeAddress.latitude,
              longitude: values.storeAddress.longitude,
            },
            storeAdmins: values.storeAdmins,
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
              description: 'Toko berhasil ditambah',
            });
          }
        }, 1500);
      }
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
          title: 'Gagal mengupdate toko',
          description: message,
        });

        setSubmitLoading((prev) => false);
      }, 1500);
    }
  };

  const handleAdminSelect = (adminId: number) => {
    const currentStoreAdmins = form.getValues('storeAdmins') || [];

    if (currentStoreAdmins?.includes(adminId)) {
      const updatedAdmins = currentStoreAdmins.filter(
        (id: number) => id !== adminId,
      );
      form.setValue('storeAdmins', updatedAdmins, { shouldDirty: true });
    } else {
      const updatedAdmins = [...currentStoreAdmins, adminId];
      form.setValue('storeAdmins', updatedAdmins, { shouldDirty: true });
    }
  };

  if (dialogPage !== 'address_main') {
    return (
      <div className="grid gap-4 max-h-[480px] overflow-y-auto px-4 md:px-6 pt-2">
        <PinPoint
          key="address_map"
          setDialogPage={setDialogPage}
          mapPin={mapPin}
          setMapPin={setMapPin}
        />
      </div>
    );
  }

  return (
    <Form {...form} key="address_main">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4 max-h-[480px] lg:max-h-[560px] overflow-y-auto px-4 md:px-6 pt-2"
      >
        <div className="grid auto-rows-max items-start gap-4 md:gap-8">
          <div className="grid auto-rows-max items-start gap-2 md:gap-4">
            <FormField
              control={form.control}
              name="storeName"
              render={({ field }: { field: any }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="text-left">Nama toko</FormLabel>
                  <FormControl>
                    <Input {...field} className="" />
                  </FormControl>
                  <FormMessage className="text-center md:text-start" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="storeAddress.address"
              render={({ field }: { field: any }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="text-left">Alamat Lengkap</FormLabel>
                  <FormControl>
                    <Input {...field} className="" />
                  </FormControl>
                  <FormMessage className="text-center md:text-start" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="storeAddress.latitude"
              render={({ field }: { field: any }) => (
                <FormItem className="hidden flex-col items-start gap-x-4">
                  <FormLabel className="text-right">Latitude</FormLabel>
                  <FormControl>
                    <Input {...field} type="hidden" className="" />
                  </FormControl>
                  <FormMessage className="text-center md:text-start" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="storeAddress.longitude"
              render={({ field }: { field: any }) => (
                <FormItem className="flex flex-col items-start gap-x-4 w-full">
                  <div className="flex justify-between items-center w-full rounded-md border px-3 py-3 text-sm ">
                    <FormLabel className="flex flex-row gap-2 items-center">
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
                      <Input {...field} type="hidden" className="" />
                    </FormControl>
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 text-main-dark h-max"
                      onClick={() => {
                        setDialogPage('store_map');
                      }}
                    >
                      {mapPin ? 'Atur Ulang' : 'Atur'}
                    </Button>
                  </div>
                  <FormMessage className="text-center md:text-start" />
                </FormItem>
              )}
            />
          </div>
          <Separator />
          <div className="grid auto-rows-max items-start gap-2">
            <FormField
              control={form.control}
              name="storeAdmins"
              render={({ field }: { field: any }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="text-left">Pilih Admin Toko</FormLabel>
                  <AdminSelect
                    field={field}
                    handleAdminSelect={handleAdminSelect}
                  />
                  <FormMessage className="ext-center md:text-start" />
                </FormItem>
              )}
            />
          </div>
          <Separator />
          <div className="grid auto-rows-max items-start gap-2">
            <FormField
              control={form.control}
              name="storeState"
              render={({ field }: { field: any }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="text-left">Status Toko</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        id="status-toko"
                        aria-label="Pilih status toko"
                        className="max-w-56 "
                      >
                        <SelectValue placeholder="Pilih status toko" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-center md:text-start" />
                </FormItem>
              )}
            />
          </div>
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

export default TambahTokoForm;
