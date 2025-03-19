import { createSlice } from "@reduxjs/toolkit";
import { ArrayCoordinatesType, ICoordinate } from "../model";
import {
  createCoordinateThunk,
  getAllCoordinatesThunk,
  updateCoordinateThunk,
  deleteCoordinateThunk,
  getCoordinatesByPathIdThunk,
} from "../api";

type CoordinateState = {
  coordinates: ArrayCoordinatesType | [];
  coordinate: ICoordinate | null; // Добавляем поле для хранения одного path
  error: string | null;
  loading: boolean;
};

const initialState: CoordinateState = {
  coordinates: [],
  coordinate: null, // Инициализируем поле
  error: null,
  loading: false,
};

const coordinateSlice = createSlice({
  name: "coordinate",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCoordinatesThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCoordinatesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.coordinates = action.payload.data;
        state.error = null;
      })
      .addCase(getAllCoordinatesThunk.rejected, (state, action) => {
        state.loading = false;
        state.coordinates = [];
        state.error = action.payload!.error ?? "Unknown error";
      })

      // Обработка нового thunk
      .addCase(getCoordinatesByPathIdThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCoordinatesByPathIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.coordinates = action.payload.data; // Сохраняем один 
        state.error = null;
      })
      .addCase(getCoordinatesByPathIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.coordinate = null;
        state.error = action.payload!.error ?? "Unknown error";
      })

      .addCase(createCoordinateThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCoordinateThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.coordinates = [...state.coordinates, action.payload.data];
        state.error = null;
      })
      .addCase(createCoordinateThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload!.error ?? "Unknown error";
      })

      .addCase(updateCoordinateThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCoordinateThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.coordinates = state.coordinates.map((coordinate) =>
          coordinate.id === action.payload.data.id
            ? action.payload.data
            : coordinate
        );
        state.error = null;
      })
      .addCase(updateCoordinateThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload!.error ?? "Unknown error";
      })

      .addCase(deleteCoordinateThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCoordinateThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.coordinates = state.coordinates.filter(
          (coordinate) => coordinate.id !== action.payload.data.id
        );
        state.error = null;
      })
      .addCase(deleteCoordinateThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload!.error ?? "Unknown error";
      });
  },
});

export const coordinateReducer = coordinateSlice.reducer;
