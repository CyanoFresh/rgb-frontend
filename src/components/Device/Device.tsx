import { useAppSelector } from '../../app/hooks';
import { selectCurrentDevice } from '../../features/devices/devicesSlice';
import React from 'react';
import { StaticMode } from './StaticMode';
import { RainbowMode } from './RainbowMode';
import { StrobeMode } from './StrobeMode';

const modeToComponent = {
  0: StaticMode,
  1: RainbowMode,
  2: StrobeMode,
};

export function Device() {
  const device = useAppSelector(selectCurrentDevice);

  const Content = modeToComponent[device.mode];

  return <Content />;
}
