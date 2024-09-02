'use client';

import React, { useState } from 'react';
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
import { useRouter, useSearchParams } from 'next/navigation';
// import { useAppDispatch } from '@/lib/hooks';
// import { register } from '@/_middlewares/auth.middleware';
import { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import axiosInstance from '@/lib/axiosInstance';

const formSchema = z.object({
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
  referrerCode: z
    .string()
    .trim()
    .min(8, { message: 'Referral code must be exactly 8 characters.' })
    .max(8, { message: 'Referral code must be exactly 8 characters.' })
    .optional()
    .or(z.literal('')),
});
const KonfirmasiForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const router = useRouter();

  const [isSubmitLoading, setSubmitLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      referrerCode: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitLoading((prev) => true);
    try {
      const res = await axiosInstance().post(
        '/auth/register',
        {
          password: values.password,
          referrerCode: values.referrerCode,
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
          form.reset();
          router.push('/login');
          toast({
            variant: 'success',
            title: res.data.message,
            description:
              'Silakan verifikasi email dengan mengakses link yang telah dikirimkan ke email anda',
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
          title: 'Registrasi gagal',
          description: message,
        });

        setSubmitLoading((prev) => false);
      }, 1500);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  autoComplete="current-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="referrerCode"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Kode referral (opsional)</FormLabel>
              <FormControl>
                <Input {...field} type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitLoading}>
          {isSubmitLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Buat akun'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default KonfirmasiForm;
