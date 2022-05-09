import { HSLColor } from '../../utils/color';
import { Box } from '@mui/material';
import React, { useCallback, useEffect } from 'react';

interface ColorSliderProps {
  color: HSLColor;
  onChangeEnd: (lightness: number) => void;
}

export function ColorSlider({ onChangeEnd, color }: ColorSliderProps) {
  const lightness = React.useRef<number>(color[2]);
  const sliderRef = React.useRef<HTMLDivElement>(null);
  const handleRef = React.useRef<HTMLDivElement>(null);
  const cleanup = React.useRef<() => void>(null as any);

  const reactToLightnessChange = useCallback((newLightness: number) => {
    if (handleRef.current) {
      lightness.current = newLightness;

      let position = (newLightness / 50) * sliderRef.current!.clientWidth;
      position = Math.max(0, Math.min(position, sliderRef.current!.clientWidth));

      handleRef.current.style.transform = `translateY(calc(50% - 10px)) translateX(calc(-50% + ${position}px))`;
    }
  }, []);

  const onMove = useCallback(
    (e: PointerEvent | React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const target = sliderRef.current!;

      const rect = target.getBoundingClientRect();

      let x = e.clientX - rect.left;
      x = Math.max(0, Math.min(x, target.clientWidth));
      const lightness = (x / rect.width) * 50;

      reactToLightnessChange(lightness);
    },
    [reactToLightnessChange],
  );

  const onMouseUp = useCallback(() => {
    onChangeEnd(lightness.current);

    cleanup.current?.();
  }, [onChangeEnd]);

  const onMouseDown = useCallback(
    (e: React.PointerEvent) => {
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
    reactToLightnessChange(color[2]);
  }, [color, reactToLightnessChange]);

  return (
    <Box
      sx={{
        width: '100%',
        position: 'relative',
        touchAction: 'none',
        userSelect: 'none',
        cursor: 'grab',
        py: 2,
      }}
      ref={sliderRef}
      onPointerDown={onMouseDown}
    >
      <Box
        sx={{
          background: `linear-gradient(90deg, #000000 0%, hsl(${color[0]}, 100%, 50%) 100%);`,
          padding: 1,
          borderRadius: 2,
          boxShadow: 4,
        }}
      />

      <Box
        ref={handleRef}
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          padding: '1px',
          width: 5,
          height: 35,
          borderRadius: 10,
          border: '4px solid #fff',
          borderTopWidth: 7,
          borderBottomWidth: 7,
          background: '#E0E0E0',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.25)',
        }}
      />
    </Box>
  );
}
