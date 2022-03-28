import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

type RequestStatus = 'initial' | 'loading' | 'error';

export interface DeviceSlice {
  requestStatus: RequestStatus;
  error: string | null;
  devices: BluetoothDevice[];
}

const initialState: DeviceSlice = {
  requestStatus: 'initial',
  error: null,
  devices: [],
};

export const requestDevice = createAsyncThunk('device/request', async () => {
  if (!navigator?.bluetooth) {
    throw new Error('Bluetooth is not supported');
  }

  const device = await navigator.bluetooth.requestDevice({
    acceptAllDevices: true,
  });

  if (!device.gatt) {
    throw new Error('Bluetooth device is not supported');
  }

  await device.gatt.connect();

  return device;
});

export const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(requestDevice.pending, (state, action) => {
      state.requestStatus = 'loading';
    });
    builder.addCase(requestDevice.fulfilled, (state, action) => {
      state.requestStatus = 'initial';
      state.devices.push(action.payload);
    });
    builder.addCase(requestDevice.rejected, (state, action) => {
      state.requestStatus = 'error';
      state.error = action.error.toString();
    });
  },
});

export const selectStatus = (state: RootState) => state.device.requestStatus;

export default deviceSlice.reducer;
