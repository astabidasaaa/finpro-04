'use client';

import { loginSocial } from '@/_middlewares/auth.middleware';
import Loading from '@/components/Loading';
import { toast } from '@/components/ui/use-toast';
import { useAppDispatch } from '@/lib/hooks';
import { AxiosError } from 'axios';
import { setCookie } from 'cookies-next';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

const RedirectPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const error = searchParams.get('error');

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (token) {
      setCookie('access-token', token, {
        domain: '.sigmart.shop',
        path: '/',
        maxAge: 1000 * 60 * 60 * 24,
        secure: true,
        httpOnly: false,
        sameSite: 'none',
      });
      loginFromSocial(token);
    }

    if (error) {
      router.push(`/login?error=${error}`);
    }
  }, []);

  const loginFromSocial = async (token: string) => {
    try {
      const res = await loginSocial({ access_token: token })(dispatch);

      setTimeout(() => {
        if (res) {
          router.replace('/');

          toast({
            variant: 'default',
            title: 'Login berhasil',
            description: 'Selamat datang di Sigmart, selamat berbelanja',
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
      }, 1500);
    }
  };

  return (
    <>
      <Loading />
    </>
  );
};

export default RedirectPage;
