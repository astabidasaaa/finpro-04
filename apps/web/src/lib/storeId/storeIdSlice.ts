import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StoreIdState {
  storeId: number;
}

const initialState: StoreIdState = {
  storeId: 1,
};

const storeIdSlice = createSlice({
  name: 'storeId',
  initialState,
  reducers: {
    setStoreId: (state: StoreIdState, action: PayloadAction<number>) => {
      state.storeId = action.payload;
    },
  },
});

export const { setStoreId } = storeIdSlice.actions;

export default storeIdSlice.reducer;
