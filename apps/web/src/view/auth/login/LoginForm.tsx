'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { login } from '@/_middlewares/auth.middleware';
import { useAppDispatch } from '@/lib/hooks';

const formSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: 'Format email tidak sesuai' })
    .min(3, {
      message: 'Email berisi minimal 3 karakter',
    })
    .max(48, { message: 'Email berisi maksimal 48 karakter' }),
  password: z
    .string()
    .min(8, { message: 'Password harus berisi lebih dari 8 karakter' }),
});

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  let redirect = searchParams.get('redirect') || '/';
  const { toast } = useToast();

  useEffect(() => {
    if (searchParams?.has('redirect')) {
      setTimeout(() => {
        toast({
          variant: 'default',
          title: 'Login diperlukan',
          description:
            'Anda telah diarahkan ke halaman login. Silakan login untuk melanjutkan',
        });
      }, 100);
    }

    if (searchParams?.has('error')) {
      const errorMessage = searchParams.get('error');
      setTimeout(() => {
        toast({
          variant: 'default',
          title: 'Login gagal',
          description: errorMessage,
        });
      }, 100);
    }
  }, [toast, searchParams]);

  const [isSubmitLoading, setSubmitLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitLoading((prev) => true);

    try {
      const res = await login({
        email: values.email,
        password: values.password,
      })(dispatch);

      setTimeout(() => {
        if (res === 'user') {
          form.reset();
          router.replace(redirect);

          toast({
            variant: 'default',
            title: 'Login berhasil',
            description: 'Selamat datang di Sigmart, selamat berbelanja',
          });
        } else if (res === 'store admin' || res === 'super admin') {
          redirect = searchParams.get('redirect') || '/dashboard';
          form.reset();
          router.replace(redirect);

          toast({
            variant: 'default',
            title: 'Login berhasil',
            description: 'Selamat datang di Dashboard Sigmart',
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
          title: 'Login gagal',
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
          name="email"
          render={({ field }) => (
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
          name="password"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <div className="flex items-center">
                <FormLabel>Password</FormLabel>{' '}
                <Link
                  href="/lupa-password"
                  className="ml-auto inline-block text-sm underline hover:no-underline"
                >
                  Lupa password?
                </Link>
              </div>
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
        <Button
          type="submit"
          className="w-full bg-main-dark hover:bg-main-dark/80"
          disabled={isSubmitLoading}
        >
          {isSubmitLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Login'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
