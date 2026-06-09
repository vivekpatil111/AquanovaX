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
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 16,
          boxShadow: '0 4px 24px -1px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.9)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 16,
          boxShadow: '0 4px 24px -1px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.9)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 12px 32px -4px rgba(14, 165, 233, 0.15), inset 0 1px 1px rgba(255,255,255,1)',
            borderColor: 'rgba(14, 165, 233, 0.3)',
            transform: 'translateY(-2px)',
          }
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(255,255,255,0.2)',
        },
        head: {
          background: 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(10px)',
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.4) !important',
          }
        }
      }
    }
  },
});
