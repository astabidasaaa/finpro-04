'use client';

import React, { useState } from 'react';
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
import { useRouter, useSearchParams } from 'next/navigation';
import { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import axiosInstance from '@/lib/axiosInstance';

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Password harus berisi lebih dari 8 karakter' }),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: 'Password tidak cocok',
    path: ['confirm'],
  });

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isSubmitLoading, setSubmitLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirm: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitLoading((prev) => true);

    try {
      const res = await axiosInstance().post('/auth/password/reset', {
        password: values.password,
        token,
      });

      setTimeout(() => {
        setSubmitLoading((prev) => false);

        if (res.status === 200) {
          form.reset();
          router.push('/login');
          toast({
            variant: 'success',
            title: res.data.message,
            description: 'Silakan login dengan password terbaru',
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
          title: 'Atur ulang password gagal',
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
                <Input {...field} type="password" autoComplete="new-password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Konfirmasi password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  autoComplete="new-password webauthn"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitLoading}
          className="bg-main-dark hover:bg-main-dark/80"
        >
          {isSubmitLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Ubah password'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
