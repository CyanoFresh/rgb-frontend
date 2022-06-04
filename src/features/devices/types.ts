import { HSLColor } from '../../utils/color';

export type ModeValue = 0 | 1 | 2;

export interface DeviceInfoMinimal {
  name: string;
}

export interface DeviceInfo extends DeviceInfoMinimal {
  batteryLevel: number;
  mode: ModeValue;
  turnOn: boolean;
  color1: HSLColor;
  speed: number;
  brightness: number;
  isReconnecting: boolean;
}

export interface DevicesSlice {
  connecting: boolean;
  devices: DeviceInfo[];
  selectedDeviceIndex: number;
  bluetoothEnabled: boolean | null;
}

export interface DeviceCache {
  bleDevice: BluetoothDevice;
  modeCharacteristic: BluetoothRemoteGATTCharacteristic;
  turnOnCharacteristic: BluetoothRemoteGATTCharacteristic;
  color1Characteristic: BluetoothRemoteGATTCharacteristic;
  speedCharacteristic: BluetoothRemoteGATTCharacteristic;
  brightnessCharacteristic: BluetoothRemoteGATTCharacteristic;
}

export interface DevicesCache {
  [deviceId: string]: DeviceCache;
}
