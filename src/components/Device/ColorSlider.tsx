import { HSLColor } from '../../utils/color';
import { Box } from '@mui/material';
import React, { useCallback, useEffect } from 'react';

interface ColorSliderProps {
  color: HSLColor;
  colorValueIndex?: 0 | 1 | 2;
  onChangeEnd: (lightness: number) => void;
  orientation?: 'horizontal' | 'vertical';
  maxValue?: number;
}

export function ColorSlider({
  onChangeEnd,
  color,
  colorValueIndex = 2,
  orientation = 'horizontal',
  maxValue = 50,
}: ColorSliderProps) {
  const valueRef = React.useRef<number>(color[colorValueIndex]);
  const sliderRef = React.useRef<HTMLDivElement>(null);
  const handleRef = React.useRef<HTMLDivElement>(null);
  const cleanup = React.useRef<() => void>(null as any);

  const reactToNewValue = useCallback(
    (newValue: number) => {
      if (handleRef.current && sliderRef.current) {
        valueRef.current = newValue;

        const size =
          orientation === 'horizontal'
            ? sliderRef.current.clientWidth
            : sliderRef.current.clientHeight;

        let position = (newValue / maxValue) * size;
        position = Math.max(0, Math.min(position, size));

        handleRef.current.style.transform = `translateY(7px) translateX(calc(-50% + ${position}px))`;
      }
    },
    [maxValue, orientation],
  );

  const onMove = useCallback(
    (e: PointerEvent | React.PointerEvent) => {
      if (sliderRef.current) {
        e.preventDefault();
        e.stopPropagation();

        const rect = sliderRef.current.getBoundingClientRect();

        let relativeCoordinate;

        if (orientation === 'horizontal') {
          const coordinate = e.clientX - rect.left;
          relativeCoordinate = coordinate / rect.width;
        } else if (orientation === 'vertical') {
          const coordinate = e.clientY - rect.top;
          relativeCoordinate = coordinate / rect.height;
        } else {
          throw new Error('Unknown orientation');
        }

        const newValue = Math.max(0, Math.min(relativeCoordinate, maxValue)) * maxValue;

        reactToNewValue(newValue);
      }
    },
    [maxValue, orientation, reactToNewValue],
  );

  const onMouseUp = useCallback(() => {
    onChangeEnd(valueRef.current);

    cleanup.current?.();
  }, [onChangeEnd]);

  const onMouseDown = useCallback(
    (e: React.PointerEvent) => {
      cleanup.current?.();

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
    reactToNewValue(color[colorValueIndex]);
  }, [color, colorValueIndex, reactToNewValue]);

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
          background: `linear-gradient(90deg, #000000, hsl(${color[0]}, 100%, 50%));`,
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
