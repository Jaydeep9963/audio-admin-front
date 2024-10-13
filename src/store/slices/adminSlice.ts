import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminState } from './type';



const initialState: AdminState = {
  user: null,
  token: null
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AdminState>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    }
  }
});

export const { setUser, logout } = adminSlice.actions;
export default adminSlice.reducer;
