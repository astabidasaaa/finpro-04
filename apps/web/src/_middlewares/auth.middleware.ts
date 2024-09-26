import { loginState, logoutState } from '@/lib/auth/authSlice';
import axiosInstance from '@/lib/axiosInstance';
import { Dispatch } from '@reduxjs/toolkit';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';

export const login = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  return async (dispatch: Dispatch): Promise<string> => {
    try {
      await axiosInstance().post('/auth/login', {
        email,
        password,
      });

      const access_token = getCookie('access-token');

      if (!access_token) throw new Error('Login gagal. Silakan login ulang.');

      const user = await axiosInstance().get(`/user/profile`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      });

      dispatch(loginState(user.data.data));

      return user.data.data.role;
    } catch (error) {
      deleteCookie('access-token', {
        domain: '.sigmart.shop',
        path: '/',
        maxAge: 1000 * 60 * 60 * 24,
        secure: true,
        httpOnly: false,
        sameSite: 'none',
      });
      dispatch(logoutState());
      throw error;
    }
  };
};

export const logout = () => {
  return async (dispatch: Dispatch) => {
    try {
      deleteCookie('access-token', {
        domain: '.sigmart.shop',
        path: '/',
        maxAge: 1000 * 60 * 60 * 24,
        secure: true,
        httpOnly: false,
        sameSite: 'none',
      });
      dispatch(logoutState());

      return true;
    } catch (error) {
      throw error;
    }
  };
};

export const loginSocial = ({ access_token }: { access_token: string }) => {
  return async (dispatch: Dispatch) => {
    try {
      const user = await axiosInstance().get(`/user/profile`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      });

      dispatch(loginState(user.data.data));

      return true;
    } catch (error) {
      deleteCookie('access-token', {
        domain: '.sigmart.shop',
        path: '/',
        maxAge: 1000 * 60 * 60 * 24,
        secure: true,
        httpOnly: false,
        sameSite: 'none',
      });
      dispatch(logoutState());
      throw error;
    }
  };
};
