'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import axiosInstance from '@/lib/axiosInstance';
import { AxiosError } from 'axios';
import { getCookie } from 'cookies-next';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Password harus berisi lebih dari 8 karakter' }),
    newPassword: z
      .string()
      .min(8, { message: 'Password harus berisi lebih dari 8 karakter' }),
    confirm: z.string(),
  })
  .refine((data) => data.newPassword === data.confirm, {
    message: 'Password tidak cocok',
    path: ['confirm'],
  });

const PasswordUbah = () => {
  const token = getCookie('access-token');

  const [isSubmitLoading, setSubmitLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      newPassword: '',
      confirm: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitLoading((prev) => true);

    try {
      const res = await axiosInstance().patch(
        '/auth/password/change',
        {
          password: values.password,
          newPassword: values.newPassword,
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

        if (res.status === 200) {
          setOpen((prev) => false);

          toast({
            variant: 'default',
            title: res.data.message,
          });
        }
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
          title: 'Ubah password gagal',
          description: message,
        });

        setSubmitLoading((prev) => false);
      }, 1500);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" type="button">
          Ubah password
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ubah password</DialogTitle>
          <DialogDescription>Pastikan password Anda benar</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }: { field: any }) => (
                <FormItem className="grid grid-cols-5 items-center gap-x-4">
                  <FormLabel className="col-span-2 text-right">
                    Password lama
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      autoComplete="current-password"
                      className="col-span-3 !mt-0"
                    />
                  </FormControl>
                  <FormMessage className="col-start-2  col-span-3 text-center md:text-start" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }: { field: any }) => (
                <FormItem className="grid grid-cols-5 items-center gap-x-4">
                  <FormLabel className="col-span-2 text-right">
                    Password baru
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      autoComplete="new-password"
                      className="col-span-3 !mt-0"
                    />
                  </FormControl>
                  <FormMessage className="col-start-2  col-span-3 text-center md:text-start" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm"
              render={({ field }: { field: any }) => (
                <FormItem className="grid grid-cols-5 items-center gap-x-4">
                  <FormLabel className="col-span-2 text-right">
                    Konfirmasi password baru
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      autoComplete="new-password webauthn"
                      className="col-span-3 !mt-0"
                    />
                  </FormControl>
                  <FormMessage className="col-start-2  col-span-3 text-center md:text-start" />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                disabled={isSubmitLoading}
                className="min-w-36"
              >
                {isSubmitLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  'Simpan'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordUbah;
