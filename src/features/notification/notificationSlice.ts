import { createSlice } from '@reduxjs/toolkit';
import { addDevice } from '../devices/devicesSlice';

interface NotificationSlice {
  open: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

const initialState = {
  open: false,
  message: '',
  type: 'info',
} as NotificationSlice;

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    openNotification(state, action) {
      state.open = true;
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    closeNotification(state) {
      state.open = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addDevice.rejected, (state, action) => {
      state.open = true;
      state.message = action.error.message as string;
      state.type = 'error';
    });
  },
});

export const { openNotification, closeNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
