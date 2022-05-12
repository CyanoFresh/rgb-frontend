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

/**
 * @author https://github.com/neilbartlett/color-temperature/blob/master/index.js
 * TODO: add 10 bit rgb
 */
export function kelvin2rgb(kelvin: number): RGBColor {
  const temperature = kelvin / 100.0;
  let red, green, blue;

  if (temperature < 66.0) {
    red = 255;
  } else {
    red = temperature - 55.0;
    red =
      351.97690566805693 + 0.114206453784165 * red - 40.25366309332127 * Math.log(red);
    if (red < 0) red = 0;
    if (red > 255) red = 255;
  }

  /* Calculate green */

  if (temperature < 66.0) {
    green = temperature - 2;
    green =
      -155.25485562709179 -
      0.44596950469579133 * green +
      104.49216199393888 * Math.log(green);
    if (green < 0) green = 0;
    if (green > 255) green = 255;
  } else {
    green = temperature - 50.0;
    green =
      325.4494125711974 +
      0.07943456536662342 * green -
      28.0852963507957 * Math.log(green);
    if (green < 0) green = 0;
    if (green > 255) green = 255;
  }

  /* Calculate blue */

  if (temperature >= 66.0) {
    blue = 255;
  } else {
    if (temperature <= 20.0) {
      blue = 0;
    } else {
      blue = temperature - 10;
      blue =
        -254.76935184120902 +
        0.8274096064007395 * blue +
        115.67994401066147 * Math.log(blue);
      if (blue < 0) blue = 0;
      if (blue > 255) blue = 255;
    }
  }

  return [red, green, blue];
}

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

// TODO: find optimal values
export const MIN_KELVIN = 2000;
export const MAX_KELVIN = 40000;
