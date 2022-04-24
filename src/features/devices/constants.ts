import React from 'react';
import PaletteIcon from '@mui/icons-material/Palette';
import RainbowIcon from '@mui/icons-material/Looks';
import StrobeIcon from '@mui/icons-material/InvertColors';

export const BATTERY_SERVICE_UUID = 'battery_service';
export const BATTERY_CHARACTERISTIC_UUID = 'battery_level';
export const MODE_SERVICE_UUID = 'd6694b21-880d-4b4a-adae-256cc1f01e7b';
export const MODE_CHARACTERISTIC_UUID = '20103538-ff6b-4c7f-9aba-36a32be2c7c2';
export const COLOR1_CHARACTERISTIC_UUID = '5903b942-0ce7-42c2-a29f-ff434521fbe2';

export const modeNames: { [key: number]: string } = {
  0: 'Static',
  1: 'Rainbow',
  2: 'Strobe',
};

export interface Mode {
  name: string;
  value: number;
  icon: React.ElementType;
}

export const modes: Mode[] = [
  {
    name: 'Static',
    value: 0,
    icon: PaletteIcon,
  },
  {
    name: 'Rainbow',
    value: 1,
    icon: RainbowIcon,
  },
  {
    name: 'Strobe',
    value: 2,
    icon: StrobeIcon,
  },
];
