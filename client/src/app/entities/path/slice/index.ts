import { createSlice } from "@reduxjs/toolkit";
import { ArrayPathsType } from "../model";
import { createPathThunk, getAllPathsThunk, updatePathThunk, deletePathThunk } from "../api";

type PathState = {
  paths: ArrayPathsType | [];
  error: string | null;
  loading: boolean;
};

const initialState: PathState = {
  paths: [],
  error: null,
  loading: false,
};

const pathSlice = createSlice({
  name: "path",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllPathsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllPathsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.paths = action.payload.data;
        state.error = null;
      })
      .addCase(getAllPathsThunk.rejected, (state, action) => {
        state.loading = false;
        state.paths = [];
        state.error = action.payload!.error ?? "Unknown error";
      })

      .addCase(createPathThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPathThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.paths = [...state.paths, action.payload.data];
        state.error = null;
      })
      .addCase(createPathThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload!.error ?? "Unknown error";
      })

      .addCase(updatePathThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePathThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.paths = state.paths.map((path) =>
          path.id === action.payload.data.id ? action.payload.data : path
        );
        state.error = null;
      })
      .addCase(updatePathThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload!.error ?? "Unknown error";
      })

      .addCase(deletePathThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePathThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.paths = state.paths.filter(
          (path) => path.id !== action.payload.data.id
        );
        state.error = null;
      })
      .addCase(deletePathThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload!.error ?? "Unknown error";
      })
  },
});

export const pathReducer = pathSlice.reducer;
