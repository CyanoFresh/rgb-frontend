import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  BATTERY_CHARACTERISTIC_UUID,
  BATTERY_SERVICE_UUID,
  COLOR1_CHARACTERISTIC_UUID,
  MODE_CHARACTERISTIC_UUID,
  MODE_SERVICE_UUID,
} from './constants';
import { RootState } from '../../app/store';
import { RGBColor } from '../../components/color';

export type ModeValue = 0 | 1 | 3;

export interface DeviceInfo {
  name: string;
  batteryLevel: number;
  mode: ModeValue;
  color1: RGBColor;
}

export interface DevicesSlice {
  connecting: boolean;
  devices: DeviceInfo[];
  selectedDeviceIndex: number;
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
  selectedDeviceIndex: 0,
};

const devicesCache: DevicesCache = {};

function parseModeValue(value: DataView): ModeValue {
  const modeValue = value.getInt8(0);

  return modeValue as ModeValue;
}

function parseColorValue(value: DataView): RGBColor {
  return Array.from(new Uint8Array(value.buffer)) as [number, number, number];
}

function parseUint8Value(value: DataView) {
  return value.getUint8(0);
}

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

  device.ongattserverdisconnected = () => {
    // TODO: reconnect https://googlechrome.github.io/samples/web-bluetooth/automatic-reconnect.html

    console.log(`${device.name} disconnected`);

    delete devicesCache[device.name!];

    dispatch(deviceDisconnected(deviceInfo));
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

  const modeValue = await modeCharacteristic.readValue();
  const color1Value = await color1Characteristic.readValue();
  const batteryValue = await batteryCharacteristic.readValue();

  console.log(`values read`);

  const mode = parseModeValue(modeValue);
  const color1 = parseColorValue(color1Value);
  const batteryLevel = parseUint8Value(batteryValue);

  const deviceInfo: DeviceInfo = {
    name: device.name!,
    batteryLevel,
    mode,
    color1,
  };

  dispatch(deviceConnected(deviceInfo));

  modeCharacteristic.addEventListener('characteristicvaluechanged', (e) => {
    console.log('mode characteristicvaluechanged');
    const value = (e.target as BluetoothRemoteGATTCharacteristic).value!;

    const mode = parseModeValue(value);

    dispatch(
      updateDevice({
        name: deviceInfo.name,
        mode,
      }),
    );
  });

  color1Characteristic.addEventListener('characteristicvaluechanged', (e) => {
    console.log('color1 characteristicvaluechanged');

    const value = (e.target as BluetoothRemoteGATTCharacteristic).value!;

    const color1 = parseColorValue(value);

    dispatch(
      updateDevice({
        name: deviceInfo.name,
        color1,
      }),
    );
  });

  batteryCharacteristic.addEventListener('characteristicvaluechanged', (e) => {
    console.log('battery characteristicvaluechanged');

    const value = (e.target as BluetoothRemoteGATTCharacteristic).value!;

    const batteryLevel = parseUint8Value(value);

    dispatch(
      updateDevice({
        name: deviceInfo.name,
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
});

export const disconnectDevice = createAsyncThunk(
  'devices/disconnect',
  async (device: DeviceInfo, { dispatch }) => {
    await dispatch(deviceDisconnected(device));

    if (!devicesCache[device.name]) {
      console.warn('Trying to disconnect device that is not connected');
      return;
    }

    await devicesCache[device.name].bleDevice.gatt?.disconnect();

    delete devicesCache[device.name];
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
  async ({ name, color }: { name: string; color: RGBColor }) => {
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
    deviceConnected(state, action: PayloadAction<DeviceInfo>) {
      state.selectedDeviceIndex = state.devices.length;
      state.devices.push(action.payload);
    },
    deviceDisconnected(state, action: PayloadAction<DeviceInfo>) {
      state.devices = state.devices.filter(
        (device) => device.name !== action.payload.name,
      );
    },
    updateDevice(state, action: PayloadAction<Partial<DeviceInfo>>) {
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
    selectDevice(state, action: PayloadAction<number>) {
      state.selectedDeviceIndex = action.payload;
    },
  },
  extraReducers(builder) {
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

export const selectCurrentDevice = (state: RootState) =>
  state.devices.devices[state.devices.selectedDeviceIndex];

export const { deviceConnected, deviceDisconnected, updateDevice, selectDevice } =
  devicesSlice.actions;

export default devicesSlice.reducer;
