import { configureStore } from '@reduxjs/toolkit';
import authSlice from './auth/authSlice';
import storeIdSlice from './storeId/storeIdSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authSlice,
      storeId: storeIdSlice,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
