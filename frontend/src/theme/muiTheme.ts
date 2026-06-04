import { createTheme } from '@mui/material/styles';

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#0EA5E9', // --color-primary-500
      light: '#7DD3FC', // --color-primary-300
      dark: '#0284C7', // --color-primary-600
      contrastText: '#ffffff',
    },
    success: {
      main: '#10B981', // --color-success
    },
    warning: {
      main: '#F59E0B', // --color-warning
    },
    error: {
      main: '#EF4444', // --color-danger
    },
    background: {
      default: '#F8FAFC',
      paper: '#ffffff',
    },
    text: {
      primary: '#0F172A', // --color-dark
      secondary: '#64748B', // --color-muted
    },
  },
  typography: {
    fontFamily: '"Inter", "system-ui", "sans-serif"',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.07)',
          border: '1px solid #E2E8F0',
        },
      },
    },
  },
});
