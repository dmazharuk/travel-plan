


 import { IServerResponse } from "@/shared/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ICompanion } from "../model";
import { axiosInstance } from "@/shared/lib/axiosInstance";
import { AxiosError } from "axios";

enum ROAD_COMPANION_API_ENDPOINTS {
  GET_COMPANIONS = '/road/:roadId/companions',
  ADD_COMPANION = '/road/:roadId/companion', // !!!
  REMOVE_COMPANION = '/road/:roadId/companions/:userId',
}




// Получить список компаньонов для маршрута

export const getCompanionsForRoad = createAsyncThunk<IServerResponse<ICompanion[]>,{roadId:number},{rejectValue:IServerResponse}>(
  ROAD_COMPANION_API_ENDPOINTS.GET_COMPANIONS,
  async({roadId},{rejectWithValue})=>{
    try {
      const {data} = await axiosInstance.get<IServerResponse<ICompanion[]>>(
        ROAD_COMPANION_API_ENDPOINTS.GET_COMPANIONS.replace(':roadId',roadId.toString())
      )
      return data
    } catch (error) {
      const err = error as AxiosError<IServerResponse>
      return rejectWithValue(
        err.response
          ? err.response.data
          : { statusCode: 500, message: 'Ошибка загрузки компаньонов', data: null },
      );
    }
  }
)

// Добавить компаньона
export const addCompanionToRoad = createAsyncThunk<IServerResponse<ICompanion>,{roadId:number,email:string},{rejectValue:IServerResponse}>(
  ROAD_COMPANION_API_ENDPOINTS.ADD_COMPANION,
  async({roadId,email},{rejectWithValue})=>{
    try {
      const {data} = await axiosInstance.post<IServerResponse<ICompanion>>(
        ROAD_COMPANION_API_ENDPOINTS.ADD_COMPANION.replace(':roadId',roadId.toString()),
        {email}
      )
      return data
    } catch (error) {
      const err = error as AxiosError<IServerResponse>
      return rejectWithValue(
        err.response
          ? err.response.data
          : { statusCode: 500, message: 'Ошибка загрузки компаньонов', data: null },
      );
    }
  }
)

// Удалить компаньона
export const removeCompanionFromRoad = createAsyncThunk<IServerResponse<ICompanion>,{roadId:number,userId:number},{rejectValue:IServerResponse}>(
  ROAD_COMPANION_API_ENDPOINTS.REMOVE_COMPANION,
  async({roadId,userId},{rejectWithValue})=>{
    try {
      const {data} = await axiosInstance.delete<IServerResponse<ICompanion>>(
        ROAD_COMPANION_API_ENDPOINTS.REMOVE_COMPANION.replace(':roadId',roadId.toString()).replace(':userId',userId.toString())// proveritb usera kotorogo udalyaesh
      )
      return data
    } catch (error) {
      const err = error as AxiosError<IServerResponse>
      return rejectWithValue(
        err.response
          ? err.response.data
          : { statusCode: 500, message: 'Ошибка загрузки компаньонов', data: null },
      );
    }
  }
)



