import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  BATTERY_CHARACTERISTIC_UUID,
  BATTERY_SERVICE_UUID,
  COLOR1_CHARACTERISTIC_UUID,
  MODE_CHARACTERISTIC_UUID,
  MODE_SERVICE_UUID,
  TURN_ON_CHARACTERISTIC_UUID,
} from '../../utils/constants';
import { RootState } from '../../app/store';
import { Color, HSLColor, HSLToRGB10bit, RGBColor } from '../../utils/color';
import { parseColorValue, parseModeValue, parseUint8Value } from './utils';

export type ModeValue = 0 | 1 | 2;

interface DeviceInfoMinimal {
  name: string;
}

export interface DeviceInfo extends DeviceInfoMinimal {
  batteryLevel: number;
  mode: ModeValue;
  turnOn: boolean;
  color1: HSLColor;
}

export interface DevicesSlice {
  connecting: boolean;
  devices: DeviceInfo[];
  selectedDeviceIndex: number;
}

interface DeviceCache {
  bleDevice: BluetoothDevice;
  modeCharacteristic: BluetoothRemoteGATTCharacteristic;
  turnOnCharacteristic: BluetoothRemoteGATTCharacteristic;
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

export const addDevice = createAsyncThunk(
  'devices/add',
  async (arg, { dispatch, getState }) => {
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

      console.log(`${deviceInfo.name} disconnected`);

      delete devicesCache[deviceInfo.name];

      dispatch(deviceDisconnected(deviceInfo));
    };

    window.onbeforeunload = (e) => {
      if ((getState() as RootState).devices.devices.length > 0) {
        e.preventDefault();
        e.returnValue = 'Devices will be disconnected';
      }
    };

    const [modeService, batteryService] = await Promise.all([
      device.gatt.getPrimaryService(MODE_SERVICE_UUID),
      device.gatt.getPrimaryService(BATTERY_SERVICE_UUID),
    ]);

    console.log(`services fetched`);

    const [
      modeCharacteristic,
      turnOnCharacteristic,
      color1Characteristic,
      batteryCharacteristic,
    ] = await Promise.all([
      modeService.getCharacteristic(MODE_CHARACTERISTIC_UUID),
      modeService.getCharacteristic(TURN_ON_CHARACTERISTIC_UUID),
      modeService.getCharacteristic(COLOR1_CHARACTERISTIC_UUID),
      batteryService.getCharacteristic(BATTERY_CHARACTERISTIC_UUID),
    ]);

    console.log(`characteristics fetched`);

    devicesCache[device.name!] = {
      bleDevice: device,
      modeCharacteristic,
      turnOnCharacteristic,
      color1Characteristic,
    };

    const modeValue = await modeCharacteristic.readValue();
    const turnOnValue = await modeCharacteristic.readValue();
    const color1Value = await color1Characteristic.readValue();
    const batteryValue = await batteryCharacteristic.readValue();

    console.log(`values read`);

    let mode, turnOn, color1, batteryLevel;

    try {
      mode = parseModeValue(modeValue);
      turnOn = Boolean(parseUint8Value(turnOnValue));
      color1 = parseColorValue(color1Value);
      batteryLevel = parseUint8Value(batteryValue);
    } catch (e) {
      console.log(e);
      debugger;
      throw e;
    }

    const deviceInfo: DeviceInfo = {
      name: device.name!,
      batteryLevel,
      mode,
      turnOn,
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

    turnOnCharacteristic.addEventListener('characteristicvaluechanged', (e) => {
      console.log('turnOn characteristicvaluechanged');
      const value = (e.target as BluetoothRemoteGATTCharacteristic).value!;

      const turnOn = Boolean(parseUint8Value(value));

      dispatch(
        updateDevice({
          name: deviceInfo.name,
          turnOn,
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

    await modeCharacteristic.startNotifications();
    await turnOnCharacteristic.startNotifications();
    await color1Characteristic.startNotifications();
    await batteryCharacteristic.startNotifications();

    console.log(`notifications started`);
  },
);

export const disconnectDevice = createAsyncThunk(
  'devices/disconnect',
  async (device: Partial<DeviceInfo> & { name: string }, { dispatch }) => {
    if (!devicesCache[device.name]) {
      console.warn('Trying to disconnect device that is not connected');
      await dispatch(deviceDisconnected(device));
      return;
    }

    // `ongattserverdisconnected` event will be fired
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

export const setTurnOn = createAsyncThunk(
  'devices/setTurnOn',
  async ({ name, turnOn }: { name: string; turnOn: boolean }) => {
    if (!devicesCache[name]) {
      throw new Error('Device not found');
    }

    await devicesCache[name].turnOnCharacteristic.writeValueWithoutResponse(
      Uint8Array.of(turnOn ? 1 : 0),
    );
  },
);

export const setColor1 = createAsyncThunk(
  'devices/setColor1',
  async ({
    name,
    color,
    convertFn = HSLToRGB10bit,
  }: {
    name: string;
    color: RGBColor;
    convertFn?: (input: Color) => Color;
  }) => {
    if (!devicesCache[name]) {
      throw new Error('Device not found');
    }

    const rgb = convertFn(color);
    const data = Uint16Array.of(...rgb);

    await devicesCache[name].color1Characteristic.writeValueWithoutResponse(data);
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
    deviceDisconnected(state, action: PayloadAction<DeviceInfoMinimal>) {
      state.selectedDeviceIndex = Math.max(0, state.selectedDeviceIndex - 1);
      state.devices = state.devices.filter(
        (device) => device.name !== action.payload.name,
      );
    },
    updateDevice(state, action: PayloadAction<DeviceInfoMinimal & Partial<DeviceInfo>>) {
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
      if (action.payload < 0 || action.payload >= state.devices.length) {
        return state;
      }

      state.selectedDeviceIndex = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(addDevice.fulfilled, (state) => {
        state.connecting = false;
      })
      .addCase(addDevice.rejected, (state, action) => {
        state.connecting = false;
        debugger;
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
