import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // { username, role, department, designation, permissions }
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      return { ...state, user: action.payload };
    },
    clearUser(state) {
      return { ...state, user: null };
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
