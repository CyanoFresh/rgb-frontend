import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCurrentDevice, setColor1 } from '../../features/devices/devicesSlice';
import React, { useCallback } from 'react';
import { Box } from '@mui/material';
import { ColorWheel } from './ColorWheel';
import LightModeIcon from '@mui/icons-material/LightMode';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { ColorSlider } from './ColorSlider';
import { HSLColor } from '../../utils/color';

export function StaticMode() {
  const device = useAppSelector(selectCurrentDevice);
  const dispatch = useAppDispatch();

  const onHueChange = useCallback(
    (hue: number) => {
      const hsl = device.color1;
      const color = [hue, 100, hsl[2]] as HSLColor;

      dispatch(setColor1({ name: device.name, color }));
    },
    [device.color1, device.name, dispatch],
  );

  const onLightnessChange = useCallback(
    (lightness: number) => {
      const hsl = device.color1;
      const color = [hsl[0], 100, lightness] as HSLColor;

      dispatch(setColor1({ name: device.name, color }));
    },
    [device.color1, device.name, dispatch],
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 3,
        overflow: 'hidden',
      }}
    >
      <ColorWheel color={device.color1} onChangeEnd={onHueChange} />

      <Box
        sx={{
          my: 5,
          width: '100%',
          maxWidth: 400,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <LightModeIcon />

        <Box sx={{ mx: 1, flexGrow: 1 }}>
          <ColorSlider
            color={device.color1}
            colorValueIndex={2}
            onChangeEnd={onLightnessChange}
          />
        </Box>

        <LightModeOutlinedIcon />
      </Box>
    </Box>
  );
}
