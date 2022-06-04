import { HSLColor, RGB12bitToHSL, RGBColor } from '../../utils/color';
import { ModeValue } from './types';

export function parseModeValue(value: DataView): ModeValue {
  const modeValue = value.getInt8(0);

  return modeValue as ModeValue;
}

export function parseColorValue(value: DataView): HSLColor {
  const rgb = Array.from(new Uint16Array(value.buffer)) as RGBColor;

  return RGB12bitToHSL(rgb);
}

export function parseUint8Value(value: DataView) {
  return value.getUint8(0);
}
