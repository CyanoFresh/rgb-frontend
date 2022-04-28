import { Color } from '../features/devices/devicesSlice';
import React from 'react';
import { styled } from '@mui/material/styles';

// const Root = styled('div')(({ theme }) => ({
//   display: 'inline-block',
//   padding: '10vw',
//   borderRadius: '100%',
//   background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
//   backgroundRepeat: 'no-repeat',
//   // backgroundSize: 'cover',
//   backgroundPosition: 'center center',
//   backgroundSize: 'auto',
//   '&::after': {
//     content: '""',
//     display: 'block',
//     padding: '30vw',
//     borderRadius: '100%',
//     background: '#ffffff',
//   },
// }));

const SvgRoot = styled('div')(({ theme }) => ({
  height: '100%',
  borderRadius: '50%',
  background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
}));

const BorderRoot = styled('div')(({ theme }) => ({
  // height: '100vw',
  maxWidth: 300,
  aspectRatio: '1 / 1',
  borderRadius: '50%',
  border: '30px solid transparent',
  background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red) border-box',
  WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
  WebkitMaskComposite: 'xor',
  maskComposite: 'exclude',
}));

export function ColorPicker({ color }: { color: Color }) {
  return (
    <BorderRoot />

    // <svg viewBox="0 0 100 100">
    //   <clipPath id="clip">
    //     <path d="M 50 0 a 50 50 0 0 1 0 100 50 50 0 0 1 0 -100 v 8 a 42 42 0 0 0 0 84 42 42 0 0 0 0 -84" />
    //   </clipPath>
    //
    //   <foreignObject x="0" y="0" width="100" height="100" clipPath="url(#clip)">
    //     <SvgRoot></SvgRoot>
    //   </foreignObject>
    // </svg>

    // <svg
    //   style={{
    //     background: `conic-gradient(from 90deg,
    //     red, #ff8000, yellow, #80ff00, lime, #00ff80, aqua, #0080ff, blue, #8000ff, fuchsia, #ff0080, red
    //     )`,
    //     width: '100%',
    //     height: '100vw',
    //     borderRadius: '50%',
    //   }}
    // >
    //   <circle cx="50%" cy="50%" r="4" fill="transparent" />
    // </svg>
    // <svg
    //   style={{
    //     // background: `conic-gradient(from 90deg,
    //     //   red, #ff8000, yellow, #80ff00, lime, #00ff80, aqua, #0080ff, blue, #8000ff, fuchsia, #ff0080, red
    //     //   )`,
    //     width: '100%',
    //     height: '100vw',
    //     // borderRadius: '50%',
    //   }}
    // >
    //   <circle cx="50%" cy="50%" r="45%" mask="url(#rmvCir)" />
    //   <mask id="rmvCir">
    //     <circle cx="50%" cy="50%" r="45%" fill="white" />
    //     <circle cx="50%" cy="50%" r="25%" fill="black" />
    //   </mask>
    // </svg>
  );
}
