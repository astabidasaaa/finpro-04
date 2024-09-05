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
  return async (dispatch: Dispatch) => {
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

      return true;
    } catch (error) {
      deleteCookie('access-token');
      throw error;
    }
  };
};

export const logout = () => {
  return async (dispatch: Dispatch) => {
    try {
      deleteCookie('access-token');
      dispatch(logoutState());

      return true;
    } catch (error) {
      throw error;
    }
  };
};

// export const keepLogin = () => {
//   return async (dispatch: Dispatch) => {
//     try {
//       const token = getCookie('access-token');
//       if (!token) throw new Error('Silakan login ulang.');

//       const user = parseJWT(token) as User;

//       if (user.username) {
//         dispatch(loginState(user));
//       }

//       return true;
//     } catch (error) {
//       if (error axiosInstanceof Error) {
//         deleteCookie('access-token');
//         deleteCookie('refresh-token');
//         throw error;
//       }
//     }
//   };
// };
