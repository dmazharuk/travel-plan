
import { axiosInstance } from '@/shared/lib/axiosInstance';
import { IServerResponse } from '@/shared/types';
import {  createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

// переписать и изменить
export const fetchCompanions = createAsyncThunk(
  'companions/fetchCompanions',
  async (roadId: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/road/${roadId}/companions`);
      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<IServerResponse>;
      return rejectWithValue(err.response?.data?.message || 'Ошибка загрузки');
    }
  }
);





// export default companionsSlice.reducer;
