import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  COLOR1_CHARACTERISTIC_UUID,
  MODE_CHARACTERISTIC_UUID,
  MODE_SERVICE_UUID,
} from './constants';
import { openNotification } from '../notification/notificationSlice';

export enum DeviceMode {
  STATIC,
  RAINBOW,
  STROBE,
}

export type Color = [number, number, number];

export interface DeviceInfo {
  name: string;
  batteryLevel?: number;
  mode?: DeviceMode;
  color1?: Color;
}

export interface DevicesSlice {
  connecting: boolean;
  devices: DeviceInfo[];
}

interface DeviceCache {
  bleDevice: BluetoothDevice;
  modeCharacteristic: BluetoothRemoteGATTCharacteristic;
  color1Characteristic: BluetoothRemoteGATTCharacteristic;
}

interface DevicesCache {
  [deviceId: string]: DeviceCache;
}

const initialState: DevicesSlice = {
  connecting: false,
  devices: [],
};

const devicesCache: DevicesCache = {};

export const addDevice = createAsyncThunk('devices/add', async (arg, { dispatch }) => {
  if (!navigator.bluetooth) {
    throw new Error('Bluetooth is not supported on your device');
  }

  let device: BluetoothDevice;

  try {
    device = await navigator.bluetooth.requestDevice({
      filters: [
        {
          services: [MODE_SERVICE_UUID],
        },
      ],
      optionalServices: ['battery_service'],
    });
  } catch (e) {
    // Prettify the error message
    if (e instanceof DOMException && e.name === 'NotFoundError') {
      throw new Error('You have not selected a device');
    }

    throw e;
  }

  if (!device.gatt) {
    throw new Error('Bluetooth device is not supported');
  }

  if (device.gatt.connected) {
    throw new Error('Device is already connected');
  }

  console.log(`${device.name} connecting...`);

  await device.gatt.connect();

  console.log(`${device.name} connected`);

  dispatch(
    deviceConnected({
      name: device.name!,
    }),
  );

  device.ongattserverdisconnected = () => {
    // TODO: reconnect https://googlechrome.github.io/samples/web-bluetooth/automatic-reconnect.html

    console.log(`${device.name} disconnected`);

    delete devicesCache[device.name!];

    dispatch(deviceDisconnected(device.name));
    dispatch(
      openNotification({
        type: 'info',
        message: `Device ${device.name} disconnected`,
      }),
    );
  };

  const modeService = await device.gatt.getPrimaryService(MODE_SERVICE_UUID);

  const modeCharacteristic = await modeService.getCharacteristic(
    MODE_CHARACTERISTIC_UUID,
  );
  await modeCharacteristic.startNotifications();
  modeCharacteristic.addEventListener('characteristicvaluechanged', (e) => {
    console.log('mode characteristicvaluechanged');

    const value = (e.target as BluetoothRemoteGATTCharacteristic).value!;

    const mode = value.getInt8(0).toString();

    dispatch(
      updateDevice({
        name: device.name,
        mode,
      }),
    );
  });
  await modeCharacteristic.readValue();

  const color1Characteristic = await modeService.getCharacteristic(
    COLOR1_CHARACTERISTIC_UUID,
  );
  await color1Characteristic.startNotifications();
  color1Characteristic.addEventListener('characteristicvaluechanged', (e) => {
    console.log('color1 characteristicvaluechanged');

    const value = (e.target as BluetoothRemoteGATTCharacteristic).value!;

    const color1 = Array.from(new Uint8Array(value.buffer));

    console.log(color1);

    dispatch(
      updateDevice({
        name: device.name,
        color1,
      }),
    );
  });
  await color1Characteristic.readValue();

  const batteryService = await device.gatt.getPrimaryService('battery_service');
  const batteryCharacteristic = await batteryService.getCharacteristic('battery_level');
  await batteryCharacteristic.startNotifications();
  batteryCharacteristic.addEventListener('characteristicvaluechanged', (e) => {
    console.log('battery characteristicvaluechanged');

    const value = (e.target as BluetoothRemoteGATTCharacteristic).value!;

    const batteryLevel = value.getUint8(0);

    dispatch(
      updateDevice({
        name: device.name,
        batteryLevel,
      }),
    );
  });
  await batteryCharacteristic.readValue();

  devicesCache[device.name!] = {
    bleDevice: device,
    modeCharacteristic,
    color1Characteristic,
  };
});

export const disconnectDevice = createAsyncThunk(
  'devices/disconnect',
  async (name: string) => {
    if (!devicesCache[name]) {
      throw new Error('Device not found');
    }

    await devicesCache[name].bleDevice.gatt?.disconnect();

    delete devicesCache[name];
  },
);

export const setMode = createAsyncThunk(
  'devices/setMode',
  async ({ name, mode }: { name: string; mode: number }) => {
    if (devicesCache[name]) {
      throw new Error('Device not found');
    }

    await devicesCache[name].modeCharacteristic.writeValueWithoutResponse(
      Uint8Array.of(mode),
    );
  },
);

export const setColor1 = createAsyncThunk(
  'devices/setColor1',
  async ({ name, color }: { name: string; color: Color }) => {
    if (!devicesCache[name]) {
      throw new Error('Device not found');
    }

    await devicesCache[name].color1Characteristic.writeValueWithoutResponse(
      Uint8Array.of(...color),
    );
  },
);

export const devicesSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    deviceConnected: (state, action: PayloadAction<DeviceInfo>) => {
      state.devices.push(action.payload);
    },
    deviceDisconnected(state, action) {
      state.devices = state.devices.filter((device) => device.name !== action.payload);
    },
    updateDevice(state, action) {
      const index = state.devices.findIndex(
        (device) => device.name === action.payload.name,
      );

      if (index === -1) {
        return;
      }

      state.devices[index] = {
        ...state.devices[index],
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addDevice.fulfilled, (state) => {
        state.connecting = false;
      })
      .addCase(addDevice.rejected, (state) => {
        state.connecting = false;
      })
      .addCase(addDevice.pending, (state) => {
        state.connecting = true;
      });
  },
});

export const { deviceConnected, deviceDisconnected, updateDevice } = devicesSlice.actions;

export default devicesSlice.reducer;
