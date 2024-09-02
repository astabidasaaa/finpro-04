'use client';

import { useAppDispatch } from '@/lib/hooks';
import { AxiosError } from 'axios';
import { getCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react';
import { toast } from './ui/use-toast';
import { Loader2Icon } from 'lucide-react';
import { loginState } from '@/lib/auth/authSlice';
import axiosInstance from '@/lib/axiosInstance';

const FirstLoad = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  const [isPageLoading, setPageLoading] = useState<boolean>(true);

  const token = getCookie('access-token');
  const getUser = async () => {
    if (token) {
      try {
        const user = await axiosInstance().get(`/user/profile`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(loginState(user.data.data));
      } catch (error: any) {
        let message = '';
        if (error instanceof AxiosError) {
          message = error.response?.data;
        } else {
          message = error.message;
        }

        toast({
          variant: 'destructive',
          title: 'Silakan login kembali',
          description: message,
        });
      }
    }

    setPageLoading(false);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      getUser();
    }
  }, []);

  return (
    <>
      {isPageLoading ? (
        <div className="h-screen w-screen flex justify-center items-center">
          <Loader2Icon className="size-24 animate-spin" />
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default FirstLoad;
