import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCurrentDevice, setColor1 } from '../../features/devices/devicesSlice';
import React, { useCallback } from 'react';
import { Box } from '@mui/material';
import { ColorWheel } from './ColorWheel';
import LightModeIcon from '@mui/icons-material/LightMode';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { ColorSlider } from './ColorSlider';
import {
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

export function StaticMode() {
  const device = useAppSelector(selectCurrentDevice);
  const dispatch = useAppDispatch();

  const onHueChange = useCallback(
    (hue: number) => {
      const hsl = device.color1;
      const lightness = hsl[2] !== 100 ? hsl[2] : 50;
      const color = [hue, 100, lightness] as HSLColor;

      dispatch(setColor1({ name: device.name, color }));
    },
    [device.color1, device.name, dispatch],
  );

  const onLightnessChange = useCallback(
    (lightness: number) => {
      const hsl = device.color1;
      const color = [hsl[0], 100, lightness] as HSLColor;

      console.log(lightness);

      dispatch(setColor1({ name: device.name, color }));
    },
    [device.color1, device.name, dispatch],
  );

  const lightness = device.color1[2];
  const kelvin = rgb2kelvin(HSLToRGB(device.color1));

  const onTemperatureChange = useCallback(
    (temperature: number) => {
      console.log({ temperature });
      const rgb = kelvin2rgb(temperature);
      console.log({ rgb });
      const color = rgb.map((v) => v * 4) as RGBColor;

      dispatch(setColor1({ name: device.name, convertFn: (color) => color, color }));
    },
    [device.name, dispatch],
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 3,
        pb: 15,
      }}
    >
      <ColorWheel color={device.color1} onChangeEnd={onHueChange} />

      <ColorSlider
        value={lightness}
        onChangeEnd={onLightnessChange}
        background={`linear-gradient(90deg, #000, hsl(${device.color1[0]}, 100%, 50%));`}
        startIcon={<LightModeIcon />}
        endIcon={<LightModeOutlinedIcon />}
      />

      <ColorSlider
        value={lightness >= 50 ? 100 - lightness : 50}
        onChangeEnd={(lightness) => onLightnessChange(100 - lightness)}
        background={`linear-gradient(90deg, #fff, hsl(${device.color1[0]}, 100%, 50%));`}
        startIcon={<LightModeOutlinedIcon />}
        endIcon={<LightModeIcon />}
      />

      {/* TODO: build gradient by MIN_KELVIN and MAX_KELVIN */}
      <ColorSlider
        value={kelvin}
        minValue={MIN_KELVIN}
        maxValue={MAX_KELVIN}
        onChangeEnd={onTemperatureChange}
        background={`linear-gradient(90deg, rgb(255, 148, 42) 0%, rgb(255, 189, 126) 12.5%, rgb(255, 216, 181) 25%, rgb(255, 235, 222) 37.5%, rgb(255, 248, 255) 50%, rgb(230, 235, 255) 62.5%, rgb(214, 226, 255) 75%, rgb(204, 220, 255) 87.5%)`}
        startIcon={<LocalFireDepartmentIcon />}
        endIcon={<AcUnitIcon />}
      />
    </Box>
  );
}
