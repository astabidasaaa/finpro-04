import { NextRequest, NextResponse } from 'next/server';
import { AxiosError } from 'axios';
import { expiryChecker } from './lib/utils';
import axiosInstance from './lib/axiosInstance';

export async function middleware(request: NextRequest) {
  const ACCESS_TOKEN = request.cookies.get('access-token')?.value || '';
  const response = NextResponse.next();
  if (ACCESS_TOKEN) {
    // check if access token is almost expired
    const isTokenExpired = await expiryChecker(ACCESS_TOKEN);

    // Refresh ACCESS_TOKEN if ACCESS_TOKEN is available but ACCESS_TOKEN is almost expired
    if (isTokenExpired) {
      try {
        const { data } = await axiosInstance().get('/auth/token/refresh', {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });

        response.cookies.set({
          name: 'access-token',
          value: data.accessToken,
          domain: '.sigmart.shop',
          path: '/',
          maxAge: 1000 * 60 * 60 * 24,
          secure: true,
          httpOnly: false,
          sameSite: 'none',
        });
      } catch (error: any) {
        response.cookies.delete({
          name: 'access-token',
          domain: '.sigmart.shop',
          path: '/',
          maxAge: 1000 * 60 * 60 * 24,
          secure: true,
          httpOnly: false,
          sameSite: 'none',
        });
      }
    }
  }

  let userState = {
    role: '',
    isVerified: false,
  };

  // fetch user profile if newAccessToken is available
  const newAccessToken =
    response.cookies.get('access-token')?.value || ACCESS_TOKEN;

  if (newAccessToken) {
    try {
      const { data } = await axiosInstance().get('/user/profile', {
        headers: {
          Authorization: `Bearer ${newAccessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      userState.role = data.data.role;
      userState.isVerified = data.data.isVerified;
    } catch (error: any) {
      response.cookies.delete({
        name: 'access-token',
        domain: '.sigmart.shop',
        path: '/',
        maxAge: 1000 * 60 * 60 * 24,
        secure: true,
        httpOnly: false,
        sameSite: 'none',
      });
    }
  }

  const forbiddenStoreAdminPaths = [
    '/dashboard/account',
    '/dashboard/product/add-product',
    '/dashboard/product/edit',
    '/dashboard/pengelolaan-toko',
    '/dashboard/promotion/general',
  ];

  const forbiddenAdminPaths = [
    '/pengaturan',
    '/cart',
    '/order-list',
    '/pembayaran',
    '/voucher',
  ];

  const url = request.nextUrl.pathname;
  // Redirect based on user role and URL
  if (userState.role) {
    if (
      url.startsWith('/login') ||
      url.startsWith('/registrasi') ||
      url.startsWith('/lupa-password') ||
      url.startsWith('/reset-password')
    ) {
      const redirect = request.nextUrl.searchParams.get('redirect') || '/';

      return NextResponse.redirect(new URL(redirect, request.url));
    }

    if (userState.role === 'user') {
      if (url.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      if (!userState.isVerified && url.startsWith('/cart')) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    if (
      userState.role !== 'user' &&
      forbiddenAdminPaths.some((path) => url.startsWith(path))
    ) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (
      userState.role === 'store admin' &&
      forbiddenStoreAdminPaths.some((path) => url.startsWith(path))
    ) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else {
    if (
      url.startsWith('/dashboard') ||
      url.startsWith('/pengaturan') ||
      url.startsWith('/cart') ||
      url.startsWith('/order-list') ||
      url.startsWith('/pembayaran') ||
      url.startsWith('/voucher')
    ) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', url);

      return NextResponse.redirect(loginUrl);
    }
  }
  return response;
}
