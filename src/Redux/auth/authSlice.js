import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  isLoad: false,
  isLoadingRequest: true,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    LoginRequest: (state) => {
      state.loading = true;
      state.isAuthenticated = false;
    },
    LoginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    LoginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    LodeUserRequest: (state) => {
      state.loading = true;
      state.isAuthenticated = false;
      state.isLoadingRequest = true;
    },
    LodeUserSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoadingRequest = false;
    },
    LodeUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.isLoadingRequest = false;
    },
    logoutRequest: (state) => {
      state.loading = true;
    },
    logoutSuccess: (state) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    },
    logoutFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = true;
    },
    clearMessage: (state) => {
      state.user = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  LoginRequest,
  LoginSuccess,
  LoginFailure,
  LodeUserRequest,
  LodeUserSuccess,
  LodeUserFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
  clearMessage,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
