import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectCurrentDevice,
  setColor1,
  setTurnOn,
} from '../../features/devices/devicesSlice';
import React, { useMemo } from 'react';
import { Box, Button } from '@mui/material';
import { ColorWheel } from './ColorWheel';
import LightModeIcon from '@mui/icons-material/LightMode';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { ColorSlider } from './ColorSlider';
import {
  buildKelvinGradient,
  HSLColor,
  HSLToRGB,
  kelvin2rgb,
  MAX_KELVIN,
  MIN_KELVIN,
  rgb2kelvin,
  RGBColor,
} from '../../utils/color';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

const kelvinsGradientCss = buildKelvinGradient()
  .map((step) => `rgb(${step[0].join(', ')}) ${step[1]}%`)
  .join(', ');

export function StaticMode() {
  const device = useAppSelector(selectCurrentDevice);
  const dispatch = useAppDispatch();

  const lightness = device.color1[2];
  const kelvin = useMemo(() => rgb2kelvin(HSLToRGB(device.color1)), [...device.color1]);

  const onHueChange = (hue: number) => {
    const hsl = device.color1;
    const lightness = hsl[2] !== 100 ? hsl[2] : 50;
    const color = [hue, 100, lightness] as HSLColor;

    dispatch(setColor1({ name: device.name, color }));
  };

  const onLightnessChange = (lightness: number) => {
    const hsl = device.color1;
    const color = [hsl[0], 100, lightness] as HSLColor;

    dispatch(setColor1({ name: device.name, color }));
  };

  const onTemperatureChange = (temperature: number) => {
    const rgb = kelvin2rgb(temperature);
    const color = rgb.map((v) => v * 16) as RGBColor;

    dispatch(setColor1({ name: device.name, convertFn: (color) => color, color }));
  };

  const handleTurnOn = () =>
    dispatch(setTurnOn({ name: device.name, turnOn: !device.turnOn }));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: 400,
        pb: 15,
        mx: 'auto',
      }}
    >
      <Box sx={{ p: 3, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <ColorWheel color={device.color1} onChangeEnd={onHueChange} />
      </Box>

      <Box sx={{ my: 1, px: 2, width: '100%' }}>
        <ColorSlider
          value={lightness}
          onChangeEnd={onLightnessChange}
          minValue={1}
          background={`linear-gradient(90deg, #000, hsl(${device.color1[0]}, 100%, 50%));`}
          startIcon={<LightModeIcon />}
          endIcon={<LightModeOutlinedIcon />}
        />
      </Box>

      <Box sx={{ my: 1, px: 2, width: '100%' }}>
        <ColorSlider
          value={lightness >= 50 ? 100 - lightness : 50}
          onChangeEnd={(lightness) => onLightnessChange(100 - lightness)}
          background={`linear-gradient(90deg, #fff, hsl(${device.color1[0]}, 100%, 50%));`}
          startIcon={<LightModeOutlinedIcon />}
          endIcon={<LightModeIcon />}
        />
      </Box>

      <Box sx={{ my: 1, px: 2, width: '100%' }}>
        <ColorSlider
          value={kelvin}
          minValue={MIN_KELVIN}
          maxValue={MAX_KELVIN}
          onChangeEnd={onTemperatureChange}
          background={`linear-gradient(90deg, ${kelvinsGradientCss})`}
          startIcon={<LocalFireDepartmentIcon />}
          endIcon={<AcUnitIcon />}
        />
      </Box>

      <Button
        startIcon={<PowerSettingsNewIcon />}
        variant="contained"
        size="large"
        sx={{ px: 4, mt: 6 }}
        onClick={handleTurnOn}
      >
        Turn {device.turnOn ? 'off' : 'on'}
      </Button>
    </Box>
  );
}
