import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#e3f2fd',
    },
    secondary: {
      main: '#2e7d32',
      light: '#f1f8e9',
    },
    warning: {
      main: '#ed6c02',
      light: '#fff3e0',
    },
    info: {
      main: '#0288d1',
      light: '#e1f5fe',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
        },
      },
    },
  },
}); 