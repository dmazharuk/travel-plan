import { axiosInstance } from "@/shared/lib/axiosInstance";
import { IServerResponse } from "@/shared/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  IRawCoordinateData,
  ICoordinate,
  ArrayCoordinatesType,
  ICoordinateChangeData,
} from "../model";
import { AxiosError } from "axios";

enum COORDINATE_THUNKS_TYPES {
  GET_ALL = "coordinate/getAll",
  CREATE = "coordinate/create",
  UPDATE = "coordinate/update",
  DELETE = "coordinate/delete",
  GET_BY_ID = "coordinate/getById",
  GET_BY_PATH_ID = "coordinate/getByPathId", // Новый тип
}

export const getAllCoordinatesThunk = createAsyncThunk<
  IServerResponse<ArrayCoordinatesType>,
  void,
  { rejectValue: IServerResponse }
>(COORDINATE_THUNKS_TYPES.GET_ALL, async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get<
      IServerResponse<ArrayCoordinatesType>
    >("/coordinates");

    return data;
  } catch (error) {
    const err = error as AxiosError<IServerResponse>;
    return rejectWithValue(err.response!.data);
  }
});


export const getCoordinatesByPathIdThunk = createAsyncThunk<
  IServerResponse<ArrayCoordinatesType>,
  number, // Принимаем pathId
  { rejectValue: IServerResponse }
>(
  COORDINATE_THUNKS_TYPES.GET_BY_PATH_ID, // Новый тип для thunk
  async (pathId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get<IServerResponse<ArrayCoordinatesType>>(
        `/coordinates/by-path/${pathId}` // Предполагаемый эндпоинт
      );
      // console.log('Coordinates data received:', data);
      return data;
    } catch (error) {
      const err = error as AxiosError<IServerResponse>;
      return rejectWithValue(err.response!.data);
    }
  }
);


export const createCoordinateThunk = createAsyncThunk<
  IServerResponse<ICoordinate>,
  IRawCoordinateData,
  { rejectValue: IServerResponse }
>(
  COORDINATE_THUNKS_TYPES.CREATE,
  async (newCoordinate, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post<IServerResponse<ICoordinate>>(
        "/coordinates",
        newCoordinate
      );

      return data;
    } catch (error) {
      const err = error as AxiosError<IServerResponse>;
      return rejectWithValue(err.response!.data);
    }
  }
);

export const updateCoordinateThunk = createAsyncThunk<
  IServerResponse<ICoordinate>,
  { id: number; updatedCoordinate: ICoordinateChangeData },
  { rejectValue: IServerResponse }
>(
  COORDINATE_THUNKS_TYPES.UPDATE,
  async ({ id, updatedCoordinate }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put<IServerResponse<ICoordinate>>(
        `/coordinates/update/${id}`,
        updatedCoordinate
      );

      return data;
    } catch (error) {
      const err = error as AxiosError<IServerResponse>;
      return rejectWithValue(err.response!.data);
    }
  }
);



export const deleteCoordinateThunk = createAsyncThunk<
  IServerResponse<ICoordinate>,
  number,
  { rejectValue: IServerResponse }
>(COORDINATE_THUNKS_TYPES.DELETE, async (id, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.delete<IServerResponse<ICoordinate>>(
      `/coordinates/delete/${id}`
    );
    console.log(data);
    
    return data;
  } catch (error) {
    const err = error as AxiosError<IServerResponse>;
    return rejectWithValue(err.response!.data);
  }
});



// Получить маршрут по ID
export const getCoordinateById = createAsyncThunk<
  IServerResponse<ICoordinate>,
  { id: number },
  { rejectValue: IServerResponse }
>(COORDINATE_THUNKS_TYPES.GET_BY_ID, async ({ id }, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get<IServerResponse<ICoordinate>>(
      `/coordinates/${id}`
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
