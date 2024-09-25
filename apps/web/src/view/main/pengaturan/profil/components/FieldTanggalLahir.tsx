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
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { getCookie } from 'cookies-next';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  dob: z.string().date(),
});

const FieldTanggalLahir = ({
  dob,
  refetch,
}: {
  dob: string;
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
      dob: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitLoading((prev) => true);

    try {
      const res = await axiosInstance().patch(
        '/user/profile',
        {
          dob: values.dob,
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
            description: 'Tanggal lahir berhasil diubah',
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
          title: 'Ubah tanggal lahir gagal',
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
          {dob ? 'Ubah' : 'Tambah'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {dob ? 'Ubah tanggal lahir' : 'Tambah tanggal lahir'}
          </DialogTitle>
          <DialogDescription>
            Pastikan tanggal lahir Anda benar
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="dob"
              render={({ field }: { field: any }) => (
                <FormItem className="grid grid-cols-4 items-center gap-x-4">
                  <FormLabel className="text-right">Tanggal lahir</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      max="2010-12-31"
                      placeholder={dob}
                      {...field}
                      autoComplete="mobile tel"
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

export default FieldTanggalLahir;
