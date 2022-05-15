import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCurrentDevice, setTurnOn } from '../../features/devices/devicesSlice';
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

    // dispatch(setColor1({ name: device.name, color }));
  };

  return (
    <Box sx={{ py: 3 }}>
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
          mb: 4,
          p: 3,
          background:
            'linear-gradient(to right, red, yellow, lime, aqua, blue, magenta, red)',
          boxShadow: 4,
        }}
      />

      <Box sx={{ px: 2 }}>
        <Typography fontWeight="bold" textTransform="uppercase" fontSize="0.8rem">
          Speed
        </Typography>

        <ColorSlider
          value={10}
          onChangeEnd={onSpeedChange}
          minValue={1}
          background={`#fff`}
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
