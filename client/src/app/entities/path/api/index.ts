import { axiosInstance } from '@/shared/lib/axiosInstance';
import { IServerResponse } from "@/shared/types";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { IRawPathData, IPath, ArrayPathsType } from '../model';
import { AxiosError } from 'axios';

enum PATH_THUNKS_TYPES {
    GET_ALL = 'path/getAll',
    CREATE = 'path/create',
    UPDATE = 'path/update',
    DELETE = 'path/delete',
  }

export const getAllPathsThunk = createAsyncThunk<
IServerResponse<ArrayPathsType>,
  void,
  { rejectValue: IServerResponse }
>(PATH_THUNKS_TYPES.GET_ALL, async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get<
    IServerResponse<ArrayPathsType>
    >('/paths');

    return data;
  } catch (error) {
    const err = error as AxiosError<IServerResponse>;
    return rejectWithValue(err.response!.data);
  }
});

export const createPathThunk = createAsyncThunk<
IServerResponse<IPath>,
IRawPathData,
  { rejectValue: IServerResponse }
>(PATH_THUNKS_TYPES.CREATE, async (newPath, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post<IServerResponse<IPath>>(
      '/paths',
      newPath
    );

    return data;
  } catch (error) {
    const err = error as AxiosError<IServerResponse>;
    // console.error('Ошибка при создании маршрута:', err.response?.data); // Логирование ошибк
    return rejectWithValue(err.response!.data);
  }
});

export const updatePathThunk = createAsyncThunk<
IServerResponse<IPath>,
  { id: number; updatedPath: IRawPathData },
  { rejectValue: IServerResponse }
>(
  PATH_THUNKS_TYPES.UPDATE,
  async ({ id, updatedPath }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put<IServerResponse<IPath>>(
        `/paths/update/${id}`,
        updatedPath
      );

      return data;
    } catch (error) {
      const err = error as AxiosError<IServerResponse>;
      return rejectWithValue(err.response!.data);
    }
  }
);

export const deletePathThunk = createAsyncThunk<
IServerResponse<IPath>,
  number,
  { rejectValue: IServerResponse }
>(PATH_THUNKS_TYPES.DELETE, async (id, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.delete<IServerResponse<IPath>>(
      `/paths/delete/${id}`
    );

    return data;
  } catch (error) {
    const err = error as AxiosError<IServerResponse>;
    return rejectWithValue(err.response!.data);
  }
});
