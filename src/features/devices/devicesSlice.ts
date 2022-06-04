import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  BATTERY_CHARACTERISTIC_UUID,
  BATTERY_SERVICE_UUID,
  BRIGHTNESS_CHARACTERISTIC_UUID,
  COLOR1_CHARACTERISTIC_UUID,
  MODE_CHARACTERISTIC_UUID,
  MODE_SERVICE_UUID,
  SPEED_CHARACTERISTIC_UUID,
  TURN_ON_CHARACTERISTIC_UUID,
} from '../../utils/constants';
import { RootState } from '../../app/store';
import { Color, HSLToRGB12bit, RGBColor } from '../../utils/color';
import { parseColorValue, parseModeValue, parseUint8Value } from './utils';
import { DeviceInfo, DeviceInfoMinimal, DevicesCache, DevicesSlice } from './types';

const initialState: DevicesSlice = {
  connecting: false,
  devices: [],
  selectedDeviceIndex: 0,
  bluetoothEnabled: null,
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
      if (
        e instanceof DOMException &&
        e.name === 'NotFoundError' &&
        e.message === 'User cancelled the requestDevice() chooser.'
      ) {
        // No error here, user just cancelled the request
        return;
      }

      throw e;
    }

    /**
     * There are two possible events that can be triggered when a device is disconnected:
     * 1. User manually disconnects the device
     * 2. Device is out of range/powered off/etc.
     * We should reconnect only on the second case.
     */
    function onDisconnect() {
      console.log(`${device.name} disconnected`);

      const isIntended = !devicesCache.hasOwnProperty(device.name!);

      if (isIntended) {
        delete devicesCache[device.name!];

        return dispatch(
          deviceDisconnected({
            name: device.name!,
          }),
        );
      }

      console.log(`Reconnecting to ${device.name} ...`);

      dispatch(
        deviceReconnecting({
          name: device.name!,
        }),
      );

      return connect();
    }

    async function connect() {
      console.log(`${device.name} connecting...`);

      await device.gatt!.connect();

      console.log(`${device.name} connected`);

      device.ongattserverdisconnected = onDisconnect;

      if (process.env.NODE_ENV === 'production') {
        window.onbeforeunload = (e) => {
          const state = getState() as RootState;

          if (state.devices.devices.length > 0) {
            e.preventDefault();
            e.returnValue = 'Devices will be disconnected';
          }
        };
      }

      const [modeService, batteryService] = await Promise.all([
        device.gatt!.getPrimaryService(MODE_SERVICE_UUID),
        device.gatt!.getPrimaryService(BATTERY_SERVICE_UUID),
      ]);

      console.log(`services fetched`);

      const [
        batteryCharacteristic,
        modeCharacteristic,
        turnOnCharacteristic,
        color1Characteristic,
        speedCharacteristic,
        brightnessCharacteristic,
      ] = await Promise.all([
        batteryService.getCharacteristic(BATTERY_CHARACTERISTIC_UUID),
        modeService.getCharacteristic(MODE_CHARACTERISTIC_UUID),
        modeService.getCharacteristic(TURN_ON_CHARACTERISTIC_UUID),
        modeService.getCharacteristic(COLOR1_CHARACTERISTIC_UUID),
        modeService.getCharacteristic(SPEED_CHARACTERISTIC_UUID),
        modeService.getCharacteristic(BRIGHTNESS_CHARACTERISTIC_UUID),
      ]);

      console.log(`characteristics fetched`);

      devicesCache[device.name!] = {
        bleDevice: device,
        modeCharacteristic,
        turnOnCharacteristic,
        color1Characteristic,
        speedCharacteristic,
        brightnessCharacteristic,
      };

      const batteryValue = await batteryCharacteristic.readValue();
      const modeValue = await modeCharacteristic.readValue();
      const turnOnValue = await turnOnCharacteristic.readValue();
      const color1Value = await color1Characteristic.readValue();
      const speedValue = await speedCharacteristic.readValue();
      const brightnessValue = await brightnessCharacteristic.readValue();

      console.log(`values read`);

      const batteryLevel = parseUint8Value(batteryValue);
      const mode = parseModeValue(modeValue);
      const turnOn = Boolean(parseUint8Value(turnOnValue));
      const color1 = parseColorValue(color1Value);
      const speed = parseUint8Value(speedValue);
      const brightness = parseUint8Value(brightnessValue);

      const deviceInfo: DeviceInfo = {
        name: device.name!,
        isReconnecting: false,
        batteryLevel,
        mode,
        turnOn,
        color1,
        speed,
        brightness,
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

      speedCharacteristic.addEventListener('characteristicvaluechanged', (e) => {
        console.log('speed characteristicvaluechanged');
        const value = (e.target as BluetoothRemoteGATTCharacteristic).value!;

        const speed = parseUint8Value(value);

        dispatch(
          updateDevice({
            name: deviceInfo.name,
            speed,
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

      brightnessCharacteristic.addEventListener('characteristicvaluechanged', (e) => {
        console.log('brightnessCharacteristic characteristicvaluechanged');

        const value = (e.target as BluetoothRemoteGATTCharacteristic).value!;

        const brightness = parseUint8Value(value);

        dispatch(
          updateDevice({
            name: deviceInfo.name,
            brightness,
          }),
        );
      });

      await batteryCharacteristic.startNotifications();
      await modeCharacteristic.startNotifications();
      await turnOnCharacteristic.startNotifications();
      await color1Characteristic.startNotifications();
      await speedCharacteristic.startNotifications();
      await brightnessCharacteristic.startNotifications();

      console.log(`notifications started`);
    }

    await connect();
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

    const deviceCache = devicesCache[device.name];

    delete devicesCache[device.name];

    // `ongattserverdisconnected` event will be fired => dispatch(deviceDisconnected(device)) will be called
    await deviceCache.bleDevice.gatt?.disconnect();
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

export const setSpeed = createAsyncThunk(
  'devices/setSpeed',
  async ({ name, speed }: { name: string; speed: number }) => {
    if (!devicesCache[name]) {
      throw new Error('Device not found');
    }

    await devicesCache[name].speedCharacteristic.writeValueWithoutResponse(
      Uint8Array.of(speed),
    );
  },
);

export const setBrightness = createAsyncThunk(
  'devices/setBrightness',
  async ({ name, brightness }: { name: string; brightness: number }) => {
    if (!devicesCache[name]) {
      throw new Error('Device not found');
    }

    await devicesCache[name].brightnessCharacteristic.writeValueWithoutResponse(
      Uint8Array.of(brightness),
    );
  },
);

export const checkBluetooth = createAsyncThunk(
  'devices/checkBluetooth',
  async (arg, { dispatch }) => {
    const available = await navigator.bluetooth.getAvailability();

    dispatch(setBluetoothAvailable(available));
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
    convertFn = HSLToRGB12bit,
  }: {
    name: string;
    color: RGBColor;
    convertFn?: (input: Color) => Color;
  }) => {
    if (!devicesCache[name]) {
      throw new Error('Device not found');
    }

    const rgb = convertFn(color);
    console.log(rgb);
    const data = Uint16Array.of(...rgb);

    await devicesCache[name].color1Characteristic.writeValueWithoutResponse(data);
  },
);

export const devicesSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    setBluetoothAvailable(state, action: PayloadAction<boolean>) {
      state.bluetoothEnabled = action.payload;
    },
    deviceConnected(state, action: PayloadAction<DeviceInfo>) {
      const index = state.devices.findIndex(
        (device) => device.name === action.payload.name,
      );

      if (index === -1) {
        state.selectedDeviceIndex = state.devices.length;
        state.devices.push(action.payload);
        return;
      }

      state.devices[index] = {
        ...state.devices[index],
        ...action.payload,
      };
    },
    deviceReconnecting(state, action: PayloadAction<DeviceInfoMinimal>) {
      const index = state.devices.findIndex(
        (device) => device.name === action.payload.name,
      );

      if (index === -1) {
        return;
      }

      state.devices[index].isReconnecting = true;
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
      })
      .addCase(addDevice.pending, (state) => {
        state.connecting = true;
      });
  },
});

export const selectCurrentDevice = (state: RootState) =>
  state.devices.devices[state.devices.selectedDeviceIndex];

export const {
  setBluetoothAvailable,
  deviceConnected,
  deviceReconnecting,
  deviceDisconnected,
  updateDevice,
  selectDevice,
} = devicesSlice.actions;

export default devicesSlice.reducer;
