import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {PrivacyPolicyState } from './type';

const initialState: PrivacyPolicyState = {
  _id: "",
  content: "",
  lastUpdated: ""
};

const PrivacyPolicySlice = createSlice({
  name: 'privacyPolicy',
  initialState,
  reducers: {
    setPrivacyPolicy: (state, action: PayloadAction<PrivacyPolicyState>) => {
        const data = action.payload;
        state._id = data._id;
        state.content = data.content;
        state.lastUpdated = data.lastUpdated;
    }
  }
});

export const { setPrivacyPolicy } = PrivacyPolicySlice.actions;
export default PrivacyPolicySlice.reducer;
