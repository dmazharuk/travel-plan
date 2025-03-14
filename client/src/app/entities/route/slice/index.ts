import { createSlice } from '@reduxjs/toolkit';

import { RouteArrayType } from '../model';
import { createRoad, deleteRoad, getAllRoads, getRoadById, updateRoad } from '../api';

type RoadState = {
  roads: RouteArrayType;
  error: string | null;
  isLoading: boolean;
};

const initialState: RoadState = {
  roads: [],
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
        state.roads = action.payload.data;
      })
      .addCase(getAllRoads.rejected, (state, action) => {
        (state.isLoading = false);
          (state.error = action.payload?.error ?? 'Unknown error');
        // state.roads = [];
      })
      // createRoadThunk
      .addCase(createRoad.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createRoad.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        if (state.roads) {
          state.roads.push(action.payload.data);
        } else {
          state.roads = [action.payload.data];
        }
      })
      .addCase(createRoad.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.error ?? 'Unknown error';
        // state.roads = [];
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
        // state.roads = [];
      })
      //deleteRoadThunk
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
        // state.roads = [];
      })
      //getRoadByIdThunk
      .addCase(getRoadById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRoadById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        const updatedRoad = action.payload.data;
        const index = state.roads.findIndex((road) => road.id === updatedRoad.id);
        if (index !== -1) {
          state.roads[index] = updatedRoad;
        } else {
          state.roads.push(updatedRoad);
        }
      })
      .addCase(getRoadById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.error ?? 'Unknown error';
      });
  },
});


export const roadReducer = roadSlice.reducer;