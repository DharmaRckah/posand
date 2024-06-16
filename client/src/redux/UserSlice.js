import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  userInfo: {
    id: null,
    name: '',
    email: '',
    // add other user properties as needed
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.token = action.payload.token;
      state.userInfo = action.payload.userInfo;
    },
    clearUser: (state) => {
      state.token = null;
      state.userInfo = {
        id: null,
        name: '',
        email: '',
        // reset other user properties as needed
      };
    },
    updateUser: (state, action) => {
      state.userInfo = {
        ...state.userInfo,
        ...action.payload,
      };
    },
    logout: (state) => {
      state.token = null;
      state.userInfo = {
        id: null,
        name: '',
        email: '',
        // reset other user properties as needed
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, clearUser, updateUser, logout } = userSlice.actions;

export default userSlice.reducer;
