import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Auth, User } from '@/types/userType';

const initialState: Auth = {
  user: {
    id: 0,
    name: '',
    email: '',
    role: '',
    isVerified: false,
    avatar: '',
    phone: '',
    referralCode: '',
  },
  status: {
    isLogin: false,
  },
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginState: (state: Auth, action: PayloadAction<User>) => {
      const user = action.payload;
      state.user = user;
      state.status.isLogin = true;
    },
    logoutState: (state: Auth) => {
      state.user = initialState.user;
      state.status = initialState.status;
    },
  },
});

export const { loginState, logoutState } = authSlice.actions;

export default authSlice.reducer;
