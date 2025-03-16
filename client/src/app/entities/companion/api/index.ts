


// import { createAsyncThunk } from "@reduxjs/toolkit";

// enum ROAD_COMPANION_API_ENDPOINTS {
//   GET_COMPANIONS = '/road/:roadId/companions',
//   ADD_COMPANION = '/road/:roadId/companions',
//   REMOVE_COMPANION = '/road/:roadId/companions/:userId',
// }
// // Получить список компаньонов для маршрута
// export const getCompanions = createAsyncThunk<
//   IServerResponse<any[]>,
//   { roadId: number },
//   { rejectValue: IServerResponse }
// >('COMPANIONS/GET', async ({ roadId }, { rejectWithValue }) => {
//   try {
//     const { data } = await axiosInstance.get<IServerResponse<any[]>>(
//       `/road/${roadId}/companions`,
//     );
//     return data;
//   } catch (error) {
//     const err = error as AxiosError<IServerResponse>;
//     return rejectWithValue(
//       err.response
//         ? err.response.data
//         : { statusCode: 500, message: 'Ошибка загрузки компаньонов', data: null },
//     );
//   }
// });

// // Добавить компаньона в маршрут
// export const addCompanion = createAsyncThunk<
//   IServerResponse<any>,
//   { roadId: number; userId: number },
//   { rejectValue: IServerResponse }
// >('COMPANIONS/ADD', async ({ roadId, userId }, { rejectWithValue }) => {
//   try {
//     const { data } = await axiosInstance.post<IServerResponse<any>>(
//       `/road/${roadId}/companions`,
//       { userId },
//     );
//     return data;
//   } catch (error) {
//     const err = error as AxiosError<IServerResponse>;
//     return rejectWithValue(
//       err.response
//         ? err.response.data
//         : { statusCode: 500, message: 'Ошибка добавления компаньона', data: null },
//     );
//   }
// });

// // Удалить компаньона из маршрута
// export const removeCompanion = createAsyncThunk<
//   IServerResponse<void>,
//   { roadId: number; userId: number },
//   { rejectValue: IServerResponse }
// >('COMPANIONS/REMOVE', async ({ roadId, userId }, { rejectWithValue }) => {
//   try {
//     const { data } = await axiosInstance.delete<IServerResponse<void>>(
//       `/road/${roadId}/companions/${userId}`,
//     );
//     return data;
//   } catch (error) {
//     const err = error as AxiosError<IServerResponse>;
//     return rejectWithValue(
//       err.response
//         ? err.response.data
//         : { statusCode: 500, message: 'Ошибка удаления компаньона', data: null },
//     );
//   }
// });
