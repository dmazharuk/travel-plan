import { axiosInstance, setAccessToken } from '@/shared/lib/axiosInstance';
import { IAuthResponseData, IResetPasswordData, IUserSignInData, IUserSignUpData } from '../model';
import { IServerResponse } from '@/shared/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

enum USER_API_ENDPOINTS {
  SIGN_IN = '/auth/signIn',
  SIGN_UP = '/auth/signUp',
  REFRESH = '/auth/refreshTokens',
  SIGN_OUT = '/auth/signOut',
  CONF_EMAIL = '/auth/confirmEmail',
  RECOVER_PASS = '/auth/recoverPassword',
  RESET_PASS = '/auth/resetPassword',
}

enum USER_THUNK_TYPES {
  SIGN_IN = 'user/signIn',
  SIGN_UP = 'user/signUp',
  REFRESH = 'user/refreshTokens',
  SIGN_OUT = 'user/signOut',
  CONF_EMAIL = 'user/confirmEmail',
  RECOVER_PASS = 'user/recoverPassword',
  RESET_PASS = 'user/resetPassword',
}

export const refreshTokensThunk = createAsyncThunk<
  IServerResponse<IAuthResponseData>,
  void,
  { rejectValue: IServerResponse }
>(USER_THUNK_TYPES.REFRESH, async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get(USER_API_ENDPOINTS.REFRESH);
    setAccessToken(data.data.accessToken);
    return data;
  } catch (error) {
    const err = error as AxiosError<IServerResponse>;
    return rejectWithValue(err.response!.data);
  }
});

export const signInThunk = createAsyncThunk<
  IServerResponse<IAuthResponseData>,
  IUserSignInData,
  { rejectValue: IServerResponse }
>(USER_THUNK_TYPES.SIGN_IN, async (userSignInData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post(
      USER_API_ENDPOINTS.SIGN_IN,
      userSignInData
    );
    setAccessToken(data.data.accessToken);
    return data;
  } catch (error) {
    const err = error as AxiosError<IServerResponse>;
    return rejectWithValue(err.response!.data);
  }
});
//
export const signUpThunk = createAsyncThunk<
  IServerResponse<IAuthResponseData>,
  IUserSignUpData,
  { rejectValue: IServerResponse }
>(USER_THUNK_TYPES.SIGN_UP, async (userSignUpData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post(
      USER_API_ENDPOINTS.SIGN_UP,
      userSignUpData
    );
    setAccessToken(data.data.accessToken);
    return data;
  } catch (error) {
    const err = error as AxiosError<IServerResponse>;
    return rejectWithValue(err.response!.data);
  }
});

export const signOutThunk = createAsyncThunk<
  IServerResponse,
  void,
  { rejectValue: IServerResponse }
>(USER_THUNK_TYPES.SIGN_OUT, async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get(USER_API_ENDPOINTS.SIGN_OUT);
    setAccessToken('');
    return data;
  } catch (error) {
    const err = error as AxiosError<IServerResponse>;
    return rejectWithValue(err.response!.data);
  }
});

export const confirmEmailThunk = createAsyncThunk<
  IServerResponse<IAuthResponseData>,
  string | undefined,
  { rejectValue: IServerResponse }
>(USER_THUNK_TYPES.CONF_EMAIL, async (token, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get(
      `${USER_API_ENDPOINTS.CONF_EMAIL}?token=${token}`
    );
    setAccessToken(data.data.accessToken);
    return data;
  } catch (error) {
    const err = error as AxiosError<IServerResponse>;
    return rejectWithValue(err.response!.data);
  }
});

export const recoverPasswordThunk = createAsyncThunk<
  IServerResponse<IAuthResponseData>,
  string,
  { rejectValue: IServerResponse }
>(USER_THUNK_TYPES.RECOVER_PASS, async (email, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/auth/recoverPassword', {
      email,
    });
    return response.data;
  } catch (error) {
    const err = error as AxiosError<IServerResponse>;
    return rejectWithValue(err.response!.data);
  }
});

export const resetPasswordThunk = createAsyncThunk<
  IServerResponse<IAuthResponseData>,
  IResetPasswordData,
  { rejectValue: IServerResponse }
>(USER_THUNK_TYPES.RESET_PASS, async (newPassword, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(
      '/auth/resetPassword',
      newPassword
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError<IServerResponse>;
    return rejectWithValue(err.response!.data);
  }
});
