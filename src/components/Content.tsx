import { useAppSelector } from '../app/hooks';
import { Device } from './Device/Device';
import { Welcome } from './Welcome';
import React from 'react';
import { TopBar } from './TopBar/TopBar';
import { BottomBar } from './BottomBar';

export function Content() {
  const devicesCount = useAppSelector((state) => !!state.devices.devices.length);

  if (!devicesCount) {
    return <Welcome />;
  }

  return (
    <>
      <TopBar />
      <Device />
      <BottomBar />
    </>
  );
}
