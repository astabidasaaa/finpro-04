'use client';

import React, { Dispatch, SetStateAction, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
import { SearchedUser } from '@/types/userType';

const formSchema = z.object({
  name: z.string().optional(),
  email: z
    .string()
    .trim()
    .email({ message: 'Format email tidak sesuai' })
    .min(3, {
      message: 'Email berisi minimal 3 karakter',
    })
    .max(48, { message: 'Email berisi maksimal 48 karakter' })
    .optional(),
  role: z.string().optional(),
  storeId: z.string().optional(),
});

const EditFormAdmin = ({
  setIsOpen,
  stores,
  user,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  stores: StoreProps[];
  user: SearchedUser;
}) => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string>(user.role.name);
  const [isSubmitLoading, setSubmitLoading] = useState<boolean>(false);
  const token = getCookie('access-token');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user.email,
      name: user.profile?.name || '',
      role: user.role.name,
      storeId: String(user.store?.id) || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitLoading((prev) => true);

    try {
      console.log(values);
      let storeId = values.storeId;
      if (values.storeId === '' || values.storeId === 'undefined') {
        storeId = undefined;
      }

      const res = await axiosInstance().patch(
        `/admins/update/${user.id}`,
        {
          email: values.email,
          name: values.name,
          role: values.role,
          storeId,
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
            description:
              'Admin sudah dapat masuk dengan data ini melalui halaman login',
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
          title: 'Gagal memperbarui data',
          description: message,
        });

        setSubmitLoading((prev) => false);
      }, 1000);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Nama" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }: { field: any }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="mail@example.com"
                  {...field}
                  autoComplete="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="gap-3">
              <FormLabel>Tipe admin</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedRole(value);
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger id="role" aria-label="Select role">
                    <SelectValue placeholder="SUPER ADMIN" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="super admin" key="super admin">
                    SUPER ADMIN
                  </SelectItem>
                  <SelectItem value="store admin" key="store admin">
                    STORE ADMIN
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedRole === 'store admin' && (
          <FormField
            control={form.control}
            name="storeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Toko</FormLabel>
                <FormDescription>
                  Opsional, akses toko dapat diatur kemudian.
                </FormDescription>
                <Select
                  onValueChange={field.onChange}
                  value={field.value} // Bind field.value for default selection
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="-- Pilih Toko --" />
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

        <Button type="submit" disabled={isSubmitLoading} className="min-w-36">
          {isSubmitLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Simpan perubahan'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default EditFormAdmin;
