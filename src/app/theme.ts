import { createTheme, responsiveFontSizes } from '@mui/material/styles';

import '@fontsource/inter/latin-300.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-700.css';

const defaultTheme = createTheme();

export const theme = responsiveFontSizes(
  createTheme({
    palette: {
      primary: {
        main: '#2F80ED',
      },
    },
    typography: {
      fontFamily: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
    components: {
      MuiButton: {
        styleOverrides: {
          contained: {
            borderRadius: defaultTheme.spacing(3),
            padding: defaultTheme.spacing(1, 3),
          },
        },
      },
    },
  }),
);
