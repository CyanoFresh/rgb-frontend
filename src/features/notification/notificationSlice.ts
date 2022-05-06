import { createSlice } from '@reduxjs/toolkit';
import {
  addDevice,
  deviceDisconnected,
  disconnectDevice,
  setColor1,
  setMode,
} from '../devices/devicesSlice';

interface NotificationSlice {
  open: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

const initialState: NotificationSlice = {
  open: false,
  message: '',
  type: 'info',
};

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
    builder.addCase(setMode.rejected, (state, action) => {
      state.open = true;
      state.message = action.error.message as string;
      state.type = 'error';
    });
    builder.addCase(setColor1.rejected, (state, action) => {
      state.open = true;
      state.message = action.error.message as string;
      state.type = 'error';
    });
    builder.addCase(disconnectDevice.rejected, (state, action) => {
      state.open = true;
      state.message = action.error.message as string;
      state.type = 'error';
    });
    builder.addCase(deviceDisconnected, (state, action) => {
      state.open = true;
      state.message = `Device ${action.payload.name} disconnected`;
      state.type = 'info';
    });
  },
});

export const { openNotification, closeNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
