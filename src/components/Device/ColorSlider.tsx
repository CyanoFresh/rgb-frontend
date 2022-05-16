import { Box } from '@mui/material';
import React, { useCallback, useEffect } from 'react';

interface ColorSliderProps {
  value: number;
  onChangeEnd: (newValue: number) => void;
  background: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  minValue?: number;
  maxValue?: number;
}

function map(
  x: number,
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number,
) {
  return Math.max(
    out_min,
    Math.min(((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min, out_max),
  );
}

export function ColorSlider({
  onChangeEnd,
  value,
  background,
  startIcon,
  endIcon,
  orientation = 'horizontal',
  minValue = 0,
  maxValue = 50,
}: ColorSliderProps) {
  const valueRef = React.useRef<number>(value);
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

        const position = map(newValue, minValue, maxValue, 0, size);

        handleRef.current.style.transform = `translateY(7px) translateX(calc(-50% + ${position}px))`;
      }
    },
    [maxValue, minValue, orientation],
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
        } else {
          const coordinate = e.clientY - rect.top;
          relativeCoordinate = coordinate / rect.height;
        }

        const newValue = map(relativeCoordinate, 0, 1, minValue, maxValue);

        reactToNewValue(newValue);
      }
    },
    [maxValue, minValue, orientation, reactToNewValue],
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
    reactToNewValue(value);
  }, [value, reactToNewValue]);

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {startIcon}

      <Box
        sx={{
          width: '100%',
          position: 'relative',
          touchAction: 'none',
          userSelect: 'none',
          cursor: 'grab',
          py: 2,
          mx: 2,
          flexGrow: 1,
        }}
        ref={sliderRef}
        onPointerDown={onMouseDown}
      >
        <Box
          sx={{
            background: background,
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

      {endIcon}
    </Box>
  );
}
