import { createSlice } from '@reduxjs/toolkit';

import { IRoad, RouteArrayType } from '../model';
import { createRoad, deleteRoad, getAllRoads, getRoadById, updateRoad } from '../api';
import {
  addCompanionToRoad,
  getCompanionsForRoad,
  removeCompanionFromRoad,
} from '../../companion/api';

type RoadState = {
  roads: RouteArrayType;
  error: string | null;
  road: IRoad | null;
  isLoading: boolean;
};

const initialState: RoadState = {
  roads: [],
  road: null,
  error: null,
  isLoading: false,
};

const roadSlice = createSlice({
  name: 'road',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getAllRoadsThunk
      .addCase(getAllRoads.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllRoads.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.roads = action.payload.data; // Данные маршрутов с автором
      })
      .addCase(getAllRoads.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.error ?? 'Unknown error';
      })
      // createRoadThunk
      .addCase(createRoad.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createRoad.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        // Если массив уже существует, добавляем новый маршрут, иначе создаем новый массив
        if (state.roads) {
          state.roads.push(action.payload.data);
        } else {
          state.roads = [action.payload.data];
        }
      })
      .addCase(createRoad.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.error ?? 'Unknown error';
      })
      // updateRoadThunk
      .addCase(updateRoad.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateRoad.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        if (state.roads) {
          state.roads = state.roads.map((road) =>
            road.id === action.payload.data.id ? action.payload.data : road,
          );
        }
      })
      .addCase(updateRoad.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.error ?? 'Unknown error';
      })
      // deleteRoadThunk
      .addCase(deleteRoad.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteRoad.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        if (state.roads) {
          state.roads = state.roads.filter((road) => road.id !== action.meta.arg.id);
        }
      })
      .addCase(deleteRoad.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.error ?? 'Unknown error';
      })
      // getRoadByIdThunk
      .addCase(getRoadById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRoadById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.road = action.payload.data;
        // const updatedRoad = action.payload.data;
        // const index = state.roads.findIndex((road) => road.id === updatedRoad.id);
        // if (index !== -1) {
        //   state.roads[index] = updatedRoad;
        // } else {
        //   state.roads.push(updatedRoad);
        // }
      })
      .addCase(getRoadById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.error ?? 'Unknown error';
      })


      
      // добавл компаньонов
      .addCase(getCompanionsForRoad.fulfilled, (state, action) => {
        if (state.road) {
          console.log(action.payload.data, ",,,,getCompanionsForRoad");
          
          // state.road.companions = action.payload.data.map((companion) => companion.User) || [];
          state.road.companions = action.payload.data.map((companion) => companion);
        }
      })
      .addCase(addCompanionToRoad.fulfilled, (state, action) => {
        if (state.road && action.payload.data) {
          console.log(action.payload.data, ",,,,");
          
          state.road.companions.push(action.payload.data);
        }
      })
      .addCase(removeCompanionFromRoad.fulfilled, (state, action) => {
        if (state.road && action.payload.data) {
          state.road.companions = state.road.companions.filter(
            (c) => c.id !== action.payload.data?.id,
          );
        }
      });
  },
});

export const roadReducer = roadSlice.reducer;
