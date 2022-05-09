import { HSLToRGB10bit, RGB10bitToHSL } from './color';

describe('Color utils', () => {
  it('HSLToRGB10bit correct conversion', () => {
    expect(HSLToRGB10bit([0, 100, 50])).toStrictEqual([1023, 0, 0]);
    expect(HSLToRGB10bit([0, 100, 0])).toStrictEqual([0, 0, 0]);
  });

  it('RGB10bitToHSL correct conversion', () => {
    expect(RGB10bitToHSL([1023, 0, 0])).toStrictEqual([0, 100, 50]);
    expect(RGB10bitToHSL([0, 0, 0])).toStrictEqual([0, 100, 0]);
  });
});
