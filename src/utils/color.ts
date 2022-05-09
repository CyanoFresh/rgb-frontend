export type Color = [number, number, number];
export type RGBColor = Color;
export type HSLColor = Color;

/**
 * @param r
 * @param g
 * @param b
 * @author https://www.30secondsofcode.org/js/s/rgb-to-hsl
 */
export const RGBToHSL = ([r, g, b]: RGBColor): HSLColor => {
  r /= 255;
  g /= 255;
  b /= 255;

  const l = Math.max(r, g, b);
  const s = l - Math.min(r, g, b);
  const h = s ? (l === r ? (g - b) / s : l === g ? 2 + (b - r) / s : 4 + (r - g) / s) : 0;

  return [
    60 * h < 0 ? 60 * h + 360 : 60 * h,
    100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
    (100 * (2 * l - s)) / 2,
  ];
};

export const RGB10bitToHSL = ([r, g, b]: RGBColor): HSLColor => {
  r /= 1023;
  g /= 1023;
  b /= 1023;

  const l = Math.max(r, g, b);
  const s = l - Math.min(r, g, b);
  const h = s ? (l === r ? (g - b) / s : l === g ? 2 + (b - r) / s : 4 + (r - g) / s) : 0;

  return [
    60 * h < 0 ? 60 * h + 360 : 60 * h,
    100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
    (100 * (2 * l - s)) / 2,
  ];
};

/**
 * @param h
 * @param s
 * @param l
 * @author https://www.30secondsofcode.org/js/s/hsl-to-rgb
 */
export const HSLToRGB = ([h, s, l]: HSLColor): RGBColor => {
  s /= 100;
  l /= 100;

  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  return [255 * f(0), 255 * f(8), 255 * f(4)] as RGBColor;
};

export const HSLToRGB10bit = ([h, s, l]: HSLColor): RGBColor => {
  s /= 100;
  l /= 100;

  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  return [1023 * f(0), 1023 * f(8), 1023 * f(4)] as RGBColor;
};

export function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}
