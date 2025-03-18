import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AlertType, AlertTypeData } from '../model';

type AlertState = {
  alerts: AlertType[];
};

const initialState: AlertState = {
  alerts: [],
};

export const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    showAlert: (state, action: PayloadAction<AlertTypeData>) => {
      const newAlert = {
        id: Date.now(),
        message: action.payload.message,
        status: action.payload.status,
      };
      state.alerts.push(newAlert);
    },

    removeAlert: (state, action: PayloadAction<number>) => {
      state.alerts = state.alerts.filter(
        (alert) => alert.id !== action.payload
      );
    },
  },
});

export const { showAlert, removeAlert } = alertsSlice.actions;

export const alertsReducer = alertsSlice.reducer;
