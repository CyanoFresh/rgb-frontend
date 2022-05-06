import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectCurrentDevice, setColor1 } from '../features/devices/devicesSlice';
import React, { useCallback } from 'react';
import { ColorPicker } from './ColorPicker';
import { Box } from '@mui/material';
import { HSLToRGB } from './color';

export function Device() {
  const device = useAppSelector(selectCurrentDevice);
  const dispatch = useAppDispatch();

  const onChangeEnd = useCallback(
    (hue: number) => {
      const rgb = HSLToRGB([hue, 100, 50]);
      dispatch(setColor1({ name: device.name, color: rgb }));
    },
    [device.name, dispatch],
  );

  let content;

  if (device.mode === 0) {
    content = (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 3,
          overflow: 'hidden',
        }}
      >
        <ColorPicker color={device.color1} onChangeEnd={onChangeEnd} />
      </Box>
    );
  }

  return <>{content}</>;
}
