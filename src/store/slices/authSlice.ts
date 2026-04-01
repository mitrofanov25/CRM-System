import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Profile } from '../../types/authTypes.ts';

interface AuthState {
  isAuth: boolean;
  profile: Profile | null;
}

const initialState: AuthState = {
  isAuth: false,
  profile: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<boolean>) => {
      state.isAuth = action.payload;
    },
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload;
    },
  },
});

export const { setAuth, setProfile } = authSlice.actions;

export default authSlice.reducer;
