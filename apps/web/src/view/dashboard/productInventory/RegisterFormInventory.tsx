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
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import axiosInstance from '@/lib/axiosInstance';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StoreProps } from '@/types/storeTypes';
import { getCookie } from 'cookies-next';
import { UpdateDetail, UpdateType } from '@/types/inventoryType';
import { Textarea } from '@/components/ui/textarea';
import { useAppSelector } from '@/lib/hooks';
import { UserType } from '@/types/userType';

const formSchema = z.object({
  stockChange: z.number().positive('Perubahan stok harus lebih dari 0'),
  description: z.string().trim().optional(),
  updateType: z.enum([UpdateType.ADD, UpdateType.REMOVE]),
  updateDetail: z.enum([
    UpdateDetail.ADJUSTMENT,
    UpdateDetail.CANCELLED_ORDER,
    UpdateDetail.DAMAGED,
    UpdateDetail.EXPIRATION,
    UpdateDetail.STOCK_IN,
    UpdateDetail.STOCK_OUT,
  ]),
  storeId: z.string(),
  productId: z.string(),
});

const RegisterFormInventory = ({
  setIsOpen,
  stores,
  products,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  stores: StoreProps[];
  products: { id: number; name: string }[];
}) => {
  const router = useRouter();
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
      productId: String(products[0].id),
      storeId: String(stores[0].id),
      updateType: UpdateType.ADD,
      updateDetail: UpdateDetail.STOCK_IN,
      description: '',
      stockChange: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitLoading((prev) => true);

    const updateTypeKey = (
      Object.keys(UpdateType) as Array<keyof typeof UpdateType>
    ).find((key) => UpdateType[key] === values.updateType);

    const updateDetailKey = (
      Object.keys(UpdateDetail) as Array<keyof typeof UpdateDetail>
    ).find((key) => UpdateDetail[key] === values.updateDetail);

    const storeId = store !== undefined ? store.id : values.storeId;

    try {
      const res = await axiosInstance().post(
        '/inventories/update',
        {
          productId: values.productId,
          storeId: storeId,
          updateType: updateTypeKey,
          updateDetail: updateDetailKey,
          description: values.description,
          stockChange: values.stockChange,
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
        form.reset();
        setIsOpen(false);
        if (res.status === 200) {
          toast({
            variant: 'success',
            title: res.data.message,
            description: 'Entri inventaris berhasil ditambahkan',
          });
        }

        window.location.reload();
      }, 1000);
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
          title: 'Entri inventaris gagal ditambahkan',
          description: message,
        });

        setSubmitLoading((prev) => false);
      }, 500);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="productId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Produk</FormLabel>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue defaultChecked={true} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {products.map((product: StoreProps) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <div className="grid grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="stockChange"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Perubahan Stok</FormLabel>
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
            name="updateType"
            render={({ field }: { field: any }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Tipe Perubahan</FormLabel>
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
                    {Object.values(UpdateType).map((type, index) => (
                      <SelectItem key={index} value={type}>
                        {type.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="updateDetail"
          render={({ field }: { field: any }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Detail Perubahan</FormLabel>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue defaultChecked={true} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(UpdateDetail).map((detail, index) => (
                    <SelectItem key={index} value={detail}>
                      {detail.toUpperCase()}
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea placeholder="Deskripsi entri inventaris" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitLoading} className="min-w-36">
          {isSubmitLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Tambah Entri Inventaris'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterFormInventory;
