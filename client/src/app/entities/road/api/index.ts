import { axiosInstance } from '@/shared/lib/axiosInstance';
import { IServerResponse } from '@/shared/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { IRoad, IRoadRowData } from '../model';

enum ROAD_THUNK_TYPES {
  ALL_ROADS = 'ALL_ROADS',
  CREATE_ROAD = 'CREATE_ROAD',
  UPDATE_ROAD = 'UPDATE_ROAD',
  DELETE_ROAD = 'DELETE_ROAD',
  GET_ROAD_BY_ID = 'GET_ROAD_BY_ID',
}

enum ROAD_API_ENDPOINTS {
  GET_ALL_ROADS = '/road/roads',
  GET_ROAD_BY_ID = '/road/:id',
  CREATE_ROAD = '/road',
  UPDATE_ROAD = '/road/update/:id', 
  DELETE_ROAD = '/road/delete/:id', 
}

// Получить все маршруты
export const getAllRoads = createAsyncThunk<
  IServerResponse<IRoad[]>,
  void,
  { rejectValue: IServerResponse }
>(ROAD_THUNK_TYPES.ALL_ROADS, async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get<IServerResponse<IRoad[]>>(
      ROAD_API_ENDPOINTS.GET_ALL_ROADS,
    );
    return data;
  } catch (error) {
    const err = error as AxiosError<IServerResponse>;
    return rejectWithValue(
      err.response
        ? err.response.data
        : { statusCode: 500, message: 'Неизвестная ошибка', data: null },
    );
  }
});

// Создать маршрут
export const createRoad = createAsyncThunk<
  IServerResponse<IRoad>,
  IRoadRowData,
  { rejectValue: IServerResponse }
>(ROAD_THUNK_TYPES.CREATE_ROAD, async (roadData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post<IServerResponse<IRoad>>(
      ROAD_API_ENDPOINTS.CREATE_ROAD,
      roadData,
    );
    return data;
  } catch (error) {
    const err = error as AxiosError<IServerResponse>;
    console.error("Ошибка при создании маршрута", err);
    return rejectWithValue(
      err.response
        ? err.response.data
        : { statusCode: 500, message: 'Неизвестная ошибка', data: null },
    );
  }
});

// Обновить маршрут
export const updateRoad = createAsyncThunk<
  IServerResponse<IRoad>,
  // { id: number; roadData: IRoad },
  { id: number; roadData: Partial<IRoad> }, // Теперь можно передавать только изменяемые поля
  { rejectValue: IServerResponse }
>(ROAD_THUNK_TYPES.UPDATE_ROAD, async ({ id, roadData }, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.put<IServerResponse<IRoad>>(
      ROAD_API_ENDPOINTS.UPDATE_ROAD.replace(':id', String(id)),
      roadData,
    );
    return data;
  } catch (error) {
    const err = error as AxiosError<IServerResponse>;
    return rejectWithValue(
      err.response
        ? err.response.data
        : { statusCode: 500, message: 'Неизвестная ошибка', data: null },
    );
  }
});

// Удалить маршрут
export const deleteRoad = createAsyncThunk<
  IServerResponse<void>,
  { id: number },
  { rejectValue: IServerResponse }
>(ROAD_THUNK_TYPES.DELETE_ROAD, async ({ id }, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.delete<IServerResponse<void>>(
      ROAD_API_ENDPOINTS.DELETE_ROAD.replace(':id', String(id)),
    );
    return data;
  } catch (error) {
    const err = error as AxiosError<IServerResponse>;
    return rejectWithValue(
      err.response
        ? err.response.data
        : { statusCode: 500, message: 'Неизвестная ошибка', data: null },
    );
  }
});

// Получить маршрут по ID
export const getRoadById = createAsyncThunk<
  IServerResponse<IRoad>,
  { id: number },
  { rejectValue: IServerResponse }
>(ROAD_THUNK_TYPES.GET_ROAD_BY_ID, async ({ id }, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get<IServerResponse<IRoad>>(
      ROAD_API_ENDPOINTS.GET_ROAD_BY_ID.replace(':id', String(id)),
    );
    return data;
  } catch (error) {
    const err = error as AxiosError<IServerResponse>;
    return rejectWithValue(
      err.response
        ? err.response.data
        : { statusCode: 500, message: 'Неизвестная ошибка', data: null },
    );
  }
});
