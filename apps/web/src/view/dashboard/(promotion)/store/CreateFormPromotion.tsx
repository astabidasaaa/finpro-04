'use client';

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AxiosError } from 'axios';
import { Loader2, Upload } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import axiosInstance from '@/lib/axiosInstance';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getCookie } from 'cookies-next';
import { Textarea } from '@/components/ui/textarea';
import { DiscountType, State } from '@/types/productTypes';
import {
  displayDiscountTypeMap,
  displayPromotionTypeMap,
  PromotionType,
} from '@/types/promotionType';
import { ScrollArea } from '@/components/ui/scroll-area';
import SelectDuration from '../components/SelectDuration';
import { formSchema } from './createPromotionSchema';
import { StoreProps } from '@/types/storeTypes';
import { useAppSelector } from '@/lib/hooks';
import { UserType } from '@/types/userType';

export default function CreatePromotionForm({
  setIsOpen,
  stores,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  stores: StoreProps[];
}) {
  const { user } = useAppSelector((state) => state.auth);
  const [store, setStore] = useState<{ id: number; name: string }>();
  const [isSubmitLoading, setSubmitLoading] = useState<boolean>(false);
  const token = getCookie('access-token');

  async function fetchData() {
    const storeResult = await axiosInstance().get(
      `${process.env.API_URL}/stores/single/${user.id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    setStore(storeResult.data.data);
  }

  useEffect(() => {
    user.role === UserType.STOREADMIN && fetchData();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      promotionState: State.DRAFT,
      storeId: String(stores[0].id),
      description: '',
      startedAt: '',
      finishedAt: '',
      quota: undefined,
      promotionType: PromotionType.TRANSACTION,
      discountType: DiscountType.PERCENT,
      discountValue: undefined,
      discountDurationSecs: 60 * 60 * 24,
      minPurchase: undefined,
      maxDeduction: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitLoading((prev) => true);

    const storeId = store !== undefined ? store.id : values.storeId;
    try {
      const res = await axiosInstance().post(
        '/promotions/store',
        { ...values, storeId: storeId },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTimeout(() => {
        setSubmitLoading((prev) => false);
        form.reset();
        setIsOpen(false);
        if (res.status === 200) {
          toast({
            variant: 'success',
            title: res.data.message,
            description: 'Promosi toko berhasil ditambahkan',
          });
        }

        window.location.reload();
      }, 1000);
    } catch (error: any) {
      let message = '';
      if (error instanceof AxiosError) {
        if (error.response?.status == 410) {
          error.response.data.errors.forEach((error: any) => {
            message += `${error.msg} \n`;
          });
        } else {
          message = error.response?.data.message;
        }
      } else {
        message = error.message;
      }

      setTimeout(() => {
        toast({
          variant: 'destructive',
          title: 'Promosi gagal ditambahkan',
          description: message,
        });

        setSubmitLoading((prev) => false);
      }, 500);
    }
  };

  return (
    <ScrollArea className="max-h-[60vh]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 pl-1 pr-2"
        >
          {user.role === UserType.SUPERADMIN && (
            <FormField
              control={form.control}
              name="storeId"
              render={({ field }: { field: any }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Toko</FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultChecked={true} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {stores.map((store: StoreProps) => (
                        <SelectItem key={store.id} value={store.id.toString()}>
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Nama promosi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deskripsi</FormLabel>
                <FormControl>
                  <Textarea placeholder="Deskripsi promosi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startedAt"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Mulai promosi</FormLabel>
                <FormControl>
                  <Input type="date" {...field} autoComplete="mobile tel" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="finishedAt"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Selesai promosi</FormLabel>
                <FormControl>
                  <Input type="date" {...field} autoComplete="mobile tel" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quota"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Kuota Kupon</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => {
                      field.onChange(
                        e.target.value ? parseInt(e.target.value) : undefined,
                      );
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="promotionType"
            render={({ field }: { field: any }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Tipe Promosi</FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue defaultChecked={true} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(PromotionType).map((type, index) => (
                      <SelectItem key={index} value={type}>
                        {displayPromotionTypeMap.get(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discountType"
            render={({ field }: { field: any }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Tipe Diskon</FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue defaultChecked={true} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(DiscountType).map((type, index) => (
                      <SelectItem key={index} value={type}>
                        {displayDiscountTypeMap.get(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discountValue"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Nilai Diskon</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => {
                      field.onChange(
                        e.target.value ? parseInt(e.target.value) : undefined,
                      );
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="minPurchase"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Minimal pembelian</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => {
                      field.onChange(
                        e.target.value ? parseInt(e.target.value) : undefined,
                      );
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxDeduction"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Maksimal potongan</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => {
                      field.onChange(
                        e.target.value ? parseInt(e.target.value) : undefined,
                      );
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discountDurationSecs"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Durasi Validitas Kupon</FormLabel>
                <Select
                  defaultValue={String(60 * 60 * 24)}
                  onValueChange={(value) => {
                    field.onChange(parseInt(value));
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue defaultChecked={true} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectDuration />
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="promotionState"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger id="status" aria-label="Select status">
                      <SelectValue defaultValue="DRAFT" placeholder="DRAFT" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="DRAFT" key="DRAFT">
                      DRAF
                    </SelectItem>
                    <SelectItem value="PUBLISHED" key="PUBLISHED">
                      TERBIT
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitLoading} className="min-w-36">
            {isSubmitLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              'Tambah Promosi'
            )}
          </Button>
        </form>
      </Form>
    </ScrollArea>
  );
}
