import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectCurrentDevice,
  setBrightness,
  setSpeed,
  setTurnOn,
} from '../../features/devices/devicesSlice';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { ColorSlider } from './ColorSlider';
import LightModeIcon from '@mui/icons-material/LightMode';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';

export function RainbowMode() {
  const device = useAppSelector(selectCurrentDevice);
  const dispatch = useAppDispatch();

  const handleTurnOn = () =>
    dispatch(setTurnOn({ name: device.name, turnOn: !device.turnOn }));

  const onSpeedChange = (speed: number) => {
    console.log({ speed });

    dispatch(setSpeed({ name: device.name, speed }));
  };

  const onBrightnessChange = (brightness: number) => {
    console.log({ brightness });

    dispatch(setBrightness({ name: device.name, brightness }));
  };

  return (
    <Box
      sx={{
        py: 3,
        maxWidth: 500,
        mx: 'auto',
      }}
    >
      <Typography
        fontWeight="bold"
        textTransform="uppercase"
        sx={{ px: 2 }}
        fontSize="0.8rem"
      >
        Will cycle through following colors:
      </Typography>

      <Box
        sx={{
          mt: 1,
          mb: 3,
          p: 3,
          background:
            'linear-gradient(to right, red, yellow, lime, aqua, blue, magenta, red)',
          boxShadow: 4,
        }}
      />

      <Box sx={{ px: 2, my: 1 }}>
        <Typography fontWeight="bold" textTransform="uppercase" fontSize="0.8rem">
          Speed
        </Typography>

        <ColorSlider
          value={device.speed}
          onChangeEnd={onSpeedChange}
          minValue={0}
          maxValue={254}
          background="#ffffff"
          startIcon={<LightModeIcon />}
          endIcon={<LightModeOutlinedIcon />}
        />
      </Box>

      <Box sx={{ px: 2, my: 1 }}>
        <Typography fontWeight="bold" textTransform="uppercase" fontSize="0.8rem">
          Brightness
        </Typography>

        <ColorSlider
          value={device.brightness}
          onChangeEnd={onBrightnessChange}
          minValue={1}
          maxValue={255}
          background="#ffffff"
          startIcon={<LightModeIcon />}
          endIcon={<LightModeOutlinedIcon />}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', pt: 10 }}>
        <Button
          startIcon={<PowerSettingsNewIcon />}
          variant="contained"
          size="large"
          sx={{ px: 4 }}
          onClick={handleTurnOn}
        >
          Turn {device.turnOn ? 'off' : 'on'}
        </Button>
      </Box>
    </Box>
  );
}
