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
  FormDescription,
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
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { getCookie } from 'cookies-next';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: 'Format email tidak sesuai' })
    .min(3, {
      message: 'Email berisi minimal 3 karakter',
    })
    .max(48, { message: 'Email berisi maksimal 48 karakter' }),
});

const FieldEmail = ({
  isPassword,
  email,
  refetch,
}: {
  isPassword: boolean;
  email: string;
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<AxiosResponse<any, any>, Error>>;
}) => {
  const token = getCookie('access-token');

  const [isSubmitLoading, setSubmitLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitLoading((prev) => true);

    try {
      const res = await axiosInstance().patch(
        '/user/profile',
        {
          email: values.email,
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
            description: 'Email berhasil diubah',
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
          title: 'Ubah email gagal',
          description: message,
        });

        setSubmitLoading((prev) => false);
      }, 1500);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="p-0 text-accent-yellow">
          {email ? 'Ubah' : 'Tambah'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{email ? 'Ubah email' : 'Tambah email'}</DialogTitle>
          <DialogDescription>
            {isPassword
              ? 'Pastikan email Anda aktif untuk keamanan dan kemudahan transaksi'
              : 'Mohon tambahkan password sebelum mengubah email Anda'}
          </DialogDescription>
        </DialogHeader>
        {isPassword && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }: { field: any }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-x-4">
                    <FormLabel className="text-right">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={email}
                        {...field}
                        autoComplete="email"
                        className="col-span-3 !mt-0"
                      />
                    </FormControl>
                    <FormMessage className="col-start-2  col-span-3 text-center md:text-start" />
                    <FormDescription className="col-start-2 col-span-4 text-center md:text-start">
                      Kami akan mengirimkan pesan verifikasi ke email baru anda
                    </FormDescription>
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
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FieldEmail;
