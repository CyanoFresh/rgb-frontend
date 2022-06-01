export type Color = [number, number, number];
export type RGBColor = Color;
export type HSLColor = Color;

/**
 * @param r
 * @param g
 * @param b
 * @param bitDepth by default 8 bit, means [0, 255] range
 *
 * @author https://www.30secondsofcode.org/js/s/rgb-to-hsl
 */
export const RGBToHSL = ([r, g, b]: RGBColor, bitDepth = 8): HSLColor => {
  const multiplier = Math.pow(2, bitDepth) - 1;

  r /= multiplier;
  g /= multiplier;
  b /= multiplier;

  const l = Math.max(r, g, b);
  const s = l - Math.min(r, g, b);
  const h = s ? (l === r ? (g - b) / s : l === g ? 2 + (b - r) / s : 4 + (r - g) / s) : 0;

  return [
    60 * h < 0 ? 60 * h + 360 : 60 * h,
    100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
    (100 * (2 * l - s)) / 2,
  ];
};

export const RGB12bitToHSL = ([r, g, b]: RGBColor): HSLColor => RGBToHSL([r, g, b], 12);

/**
 * @param h Hue
 * @param s Saturation
 * @param l Lightness
 * @param bitDepth by default 8 bit, means [0, 255] range
 *
 * @author https://www.30secondsofcode.org/js/s/hsl-to-rgb
 */
export const HSLToRGB = ([h, s, l]: HSLColor, bitDepth = 8): RGBColor => {
  s /= 100;
  l /= 100;

  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  const multiplier = Math.pow(2, bitDepth) - 1;

  return [multiplier * f(0), multiplier * f(8), multiplier * f(4)];
};

export const HSLToRGB12bit = ([h, s, l]: HSLColor): RGBColor => HSLToRGB([h, s, l], 12);

export const radToDeg = (rad: number): number => (rad * 180) / Math.PI;

/**
 * @link https://github.com/neilbartlett/color-temperature/blob/master/index.js
 * TODO: add 10 bit rgb
 */
export function kelvin2rgb(kelvin: number): RGBColor {
  const temp = kelvin / 100;
  let r, g, b;

  if (temp < 66) {
    r = 255;
    g =
      temp < 6
        ? 0
        : -155.25485562709179 -
          0.44596950469579133 * (g = temp - 2) +
          104.49216199393888 * Math.log(g);
    b =
      temp < 20
        ? 0
        : -254.76935184120902 +
          0.8274096064007395 * (b = temp - 10) +
          115.67994401066147 * Math.log(b);
  } else {
    r =
      351.97690566805693 +
      0.114206453784165 * (r = temp - 55) -
      40.25366309332127 * Math.log(r);
    g =
      325.4494125711974 +
      0.07943456536662342 * (g = temp - 50) -
      28.0852963507957 * Math.log(g);
    b = 255;
  }

  return [r, g, b];
}

/**
 * @link https://github.com/gka/chroma.js/blob/2d7dab5e78f40113df5574c3ad278222936aa282/src/io/temp/temperature2rgb.js
 */
export function rgb2kelvin([r, , b]: RGBColor): number {
  const epsilon = 0.4;

  let temperature = MIN_KELVIN;
  let minTemperature = MIN_KELVIN;
  let maxTemperature = MAX_KELVIN;

  while (maxTemperature - minTemperature > epsilon) {
    temperature = (maxTemperature + minTemperature) / 2;

    const [testR, , testB] = kelvin2rgb(temperature);

    if (testB / testR >= b / r) {
      maxTemperature = temperature;
    } else {
      minTemperature = temperature;
    }
  }

  return Math.round(temperature);
}

export const MIN_KELVIN = 1000;
export const MAX_KELVIN = 9000;

export function buildKelvinGradient(
  count = 10,
  min = MIN_KELVIN,
  max = MAX_KELVIN,
): Array<[Color, number]> {
  const range = max - min;
  const step = range / count;

  const result = [];

  for (let i = 0; i < count; i++) {
    const kelvin = min + i * step;
    const rgb = kelvin2rgb(kelvin);
    const percent = Math.round((i / count) * 100);

    result.push([rgb, percent] as [Color, number]);
  }

  return result;
}
