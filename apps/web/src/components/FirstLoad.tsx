'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '@/lib/hooks';
import { useAppSelector } from '@/lib/hooks';
import { AxiosError } from 'axios';
import { CookieValueTypes, getCookie } from 'cookies-next';
import { toast } from './ui/use-toast';
import { Loader2Icon } from 'lucide-react';
import { loginState } from '@/lib/auth/authSlice';
import axiosInstance from '@/lib/axiosInstance';
import { setStoreId } from '@/lib/storeId/storeIdSlice';

type TLocationState = {
  latitude: number | null;
  longitude: number | null;
};

const FirstLoad = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const login_data = useAppSelector((state) => state.auth);

  const [isPageLoading, setPageLoading] = useState<boolean>(true);

  const token = getCookie('access-token');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      getUser();

      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(({ coords }) => {
          const { latitude, longitude } = coords;
          getNearestStoreId(latitude, longitude);
        });
      }

      setPageLoading(false);
    }
  }, []);

  const getUser = async () => {
    if (token) {
      try {
        const res = await axiosInstance().get(`/user/profile`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(loginState(res.data.data));
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
  };

  const getNearestStoreId = async (latitude: number, longitude: number) => {
    if (latitude && longitude) {
      try {
        const res = await axiosInstance().post(
          `/stores/nearest-store/`,
          { latitude, longitude },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        dispatch(setStoreId(res.data.data.storeId));
      } catch (error: any) {
        let message = '';
        if (error instanceof AxiosError) {
          message = error.response?.data;
        } else {
          message = error.message;
        }

        toast({
          variant: 'destructive',
          title: 'Terjadi kesalahan',
          description: message,
        });
      }
    }
  };

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
