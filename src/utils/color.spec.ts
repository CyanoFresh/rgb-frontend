import { buildKelvinGradient, HSLToRGB12bit, RGB12bitToHSL } from './color';

describe('Color utils', () => {
  it('HSLToRGB10bit() correct conversion', () => {
    expect(HSLToRGB12bit([0, 100, 50])).toStrictEqual([4095, 0, 0]);
    expect(HSLToRGB12bit([0, 100, 0])).toStrictEqual([0, 0, 0]);
  });

  it('RGB12bitToHSL() correct conversion', () => {
    expect(RGB12bitToHSL([4095, 0, 0])).toStrictEqual([0, 100, 50]);
    expect(RGB12bitToHSL([0, 0, 0])).toStrictEqual([0, 0, 0]);
  });

  it('buildKelvinGradient()', () => {
    const actual = buildKelvinGradient(10, 2000, 9000);

    // Hard-coded acceptable values
    const expected = [
      [[255, 138.73888723717587, 19.86765886013336], 0],
      [[255, 169.9432008860151, 87.04257247828559], 10],
      [[255, 192.6163576062019, 132.72556786992732], 20],
      [[255, 210.16581069193273, 168.12379350538353], 30],
      [[255, 224.29356417554072, 197.46797649312444], 40],
      [[255, 235.97314641814518, 222.81858413094005], 50],
      [[255, 245.81388934587522, 245.3355998296068], 60],
      [[247.3440713907425, 244.26322799643938, 255], 70],
      [[231.82206070934853, 236.01010446089475, 255], 80],
      [[221.04124866337528, 229.87030217171187, 255], 90],
    ];

    expect(actual).toEqual(expected);
  });
});
