import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  BATTERY_CHARACTERISTIC_UUID,
  BATTERY_SERVICE_UUID,
  COLOR1_CHARACTERISTIC_UUID,
  MODE_CHARACTERISTIC_UUID,
  MODE_SERVICE_UUID,
} from './constants';

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
  selectedDeviceIndex: number | null;
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
  selectedDeviceIndex: null,
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
      throw new Error(e.message);
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
  };

  const [modeService, batteryService] = await Promise.all([
    device.gatt.getPrimaryService(MODE_SERVICE_UUID),
    device.gatt.getPrimaryService(BATTERY_SERVICE_UUID),
  ]);

  console.log(`services fetched`);

  const [modeCharacteristic, color1Characteristic, batteryCharacteristic] =
    await Promise.all([
      modeService.getCharacteristic(MODE_CHARACTERISTIC_UUID),
      modeService.getCharacteristic(COLOR1_CHARACTERISTIC_UUID),
      batteryService.getCharacteristic(BATTERY_CHARACTERISTIC_UUID),
    ]);

  console.log(`characteristics fetched`);

  devicesCache[device.name!] = {
    bleDevice: device,
    modeCharacteristic,
    color1Characteristic,
  };

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

  color1Characteristic.addEventListener('characteristicvaluechanged', (e) => {
    console.log('color1 characteristicvaluechanged');

    const value = (e.target as BluetoothRemoteGATTCharacteristic).value!;

    const color1 = Array.from(new Uint8Array(value.buffer));

    dispatch(
      updateDevice({
        name: device.name,
        color1,
      }),
    );
  });

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

  await Promise.all([
    modeCharacteristic.startNotifications(),
    color1Characteristic.startNotifications(),
    batteryCharacteristic.startNotifications(),
  ]);

  console.log(`notifications started`);

  await Promise.all([
    modeCharacteristic.readValue(),
    color1Characteristic.readValue(),
    batteryCharacteristic.readValue(),
  ]);

  console.log(`values read`);
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
    if (!devicesCache[name]) {
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
      state.selectedDeviceIndex = state.devices.length;
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
    selectDevice(state, action) {
      state.selectedDeviceIndex = action.payload;
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

export const { deviceConnected, deviceDisconnected, updateDevice, selectDevice } =
  devicesSlice.actions;

export default devicesSlice.reducer;
