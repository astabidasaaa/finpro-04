import { NextRequest, NextResponse } from 'next/server';
import { AxiosError } from 'axios';
import { expiryChecker } from './lib/utils';
import axiosInstance from './lib/axiosInstance';
import { toast } from './components/ui/use-toast';

export async function middleware(request: NextRequest) {
  const ACCESS_TOKEN = request.cookies.get('access-token')?.value || '';
  const response = NextResponse.next();
  if (ACCESS_TOKEN) {
    // check if access token is almost expired
    const isTokenExpired = await expiryChecker(ACCESS_TOKEN);
    // Refresh ACCESS_TOKEN if ACCESS_TOKEN is available but ACCESS_TOKEN is almost expired
    if (isTokenExpired) {
      try {
        const { data } = await axiosInstance().get('/auth/refresh-token', {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
        response.cookies.set('access-token', data.result.accessToken);
      } catch (error: any) {
        let message = '';
        if (error instanceof AxiosError) {
          message = error.response?.data.message;
        } else {
          message = error.message;
        }
        response.cookies.delete('access-token');
        toast({
          variant: 'default',
          title: 'Sesi login habis',
          description: message,
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
      let message = '';
      if (error instanceof AxiosError) {
        message = error.response?.data.message;
      } else {
        message = error.message;
      }
      response.cookies.delete('access-token');
    }
  }
  const url = request.nextUrl.pathname;
  // Redirect based on user role and URL
  if (userState.role) {
    if (
      url.startsWith('/login') ||
      url.startsWith('/registrasi') ||
      url.startsWith('/lupa-password') ||
      url.startsWith('/reset-password')
    ) {
      // const redirect = request.nextUrl.searchParams.get('redirect') || '/';

      return NextResponse.redirect(new URL( request.url));
    }
    // if (url.startsWith('/dashboard') && userState.role === 'user') {
    //   return NextResponse.redirect(new URL('/', request.url));
    // }
    // if (url.startsWith('/pengaturan') && userState.role !== 'user') {
    //   return NextResponse.redirect(new URL('/', request.url));
    // }
  } else {
    if (url.startsWith('/pengaturan')) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', url);

      return NextResponse.redirect(loginUrl);
    }
  }
  return response;
}

// export const config = {
//   matcher: [
//     '/login',
//     '/register',
//     '/dashboard/:path*',
//     '/transaction/:path*',
//     '/event/:path*',
//   ],
// };
