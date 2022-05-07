import React, { useCallback, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { radToDeg, RGBColor, RGBToHSL } from './color';

const ShadowWrap = styled('div')(({ theme }) => ({
  filter: 'drop-shadow(0 4px 4px rgba(50, 50, 0, 0.5))',
  width: '100%',
  height: '100%',
}));

const Wheel = styled('div', {
  name: 'current-color',
})(({ theme }) => ({
  borderRadius: '50%',
  border: '40px solid transparent',
  background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red) border-box',
  WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
  WebkitMaskComposite: 'xor',
  maskComposite: 'exclude',
  width: '100%',
  height: '100%',
}));

const CurrentColor = styled('div', {
  name: 'current-color',
})(({ theme }) => ({
  width: 50,
  height: 50,
  borderRadius: '50%',
  background: '#222',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
}));

const Root = styled('div')(({ theme }) => ({
  position: 'relative',
  aspectRatio: '1',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    maxWidth: 300,
  },
  // usability fixes:
  userSelect: 'none',
  touchAction: 'none',
  cursor: 'grab',
}));

function Handle({ rootRef }: { rootRef: React.Ref<HTMLDivElement> }) {
  return (
    <Box
      ref={rootRef}
      sx={{
        position: 'absolute',
        top: '50%',
        width: '100%',
        height: 10,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: -5,
          width: 50,
          height: 12,
          borderRadius: 10,
          border: '5px solid #fff',
          borderRightWidth: 7,
          borderLeftWidth: 7,
          background: '#E0E0E0',
          // transform: 'translateX(45px)',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.25)',
        }}
      />
    </Box>
  );
}

interface ColorPickerProps {
  color: RGBColor;
  onChangeEnd: (hue: number) => void;
}

export function ColorPicker({ color, onChangeEnd }: ColorPickerProps) {
  const wheelRef = React.useRef<HTMLDivElement>(null);
  const handleRef = React.useRef<HTMLDivElement>(null);
  const currentColorRef = React.useRef<HTMLDivElement>(null);
  const cleanup = React.useRef<() => void>(null as any);
  const hueRef = React.useRef<number>(RGBToHSL(color)[0]);

  const reactToHueChange = useCallback((hue: number) => {
    if (handleRef.current && currentColorRef.current) {
      hueRef.current = hue;

      handleRef.current.style.transform = `translateY(-50%) rotate(calc(${hue + 90}deg))`;

      currentColorRef.current.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
    }
  }, []);

  const onMove = useCallback(
    (e: PointerEvent | React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const target = wheelRef.current!;

      const rect = target.getBoundingClientRect();

      const x = e.clientX - rect.x - rect.width / 2;
      const y = e.clientY - rect.y - rect.height / 2;

      const angle = radToDeg(Math.atan2(y, x));
      const hue = (angle + 360 + 90) % 360;

      reactToHueChange(hue);
    },
    [reactToHueChange],
  );

  const onMouseUp = useCallback(() => {
    console.log('up');

    onChangeEnd(hueRef.current);

    cleanup.current?.();
  }, [onChangeEnd]);

  const onMouseDown = useCallback(
    (e: React.PointerEvent) => {
      console.log('down', e);

      if (cleanup.current) {
        cleanup.current();
      }

      window.addEventListener('pointermove', onMove, { passive: false });
      window.addEventListener('pointerup', onMouseUp, { passive: false });

      cleanup.current = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onMouseUp);

        cleanup.current = null as any;
      };

      // Handle click as a first move
      onMove(e);
    },
    [onMove, onMouseUp],
  );

  // Unsubscribe on unmount
  useEffect(() => () => cleanup.current?.(), []);

  useEffect(() => {
    const hsl = RGBToHSL(color);

    reactToHueChange(hsl[0]);
  }, [color, reactToHueChange]);

  return (
    <Root onPointerDown={onMouseDown}>
      <ShadowWrap>
        <Wheel ref={wheelRef} />

        <CurrentColor ref={currentColorRef} />
      </ShadowWrap>

      <Handle rootRef={handleRef} />
    </Root>
  );
}
