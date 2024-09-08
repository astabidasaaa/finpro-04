'use client';

import { setCookie } from 'cookies-next';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

const RedirectPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const error = searchParams.get('error');

  useEffect(() => {
    if (token) {
      setCookie('access-token', token);
      router.replace('/');
    }

    if (error) {
      router.replace(`/login?error=${error}`);
    }
  }, []);

  return <></>;
};

export default RedirectPage;
