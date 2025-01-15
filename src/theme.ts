import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFA500',
      light: '#FFB733',
      dark: '#CC8400',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#333333',
      light: '#4D4D4D',
      dark: '#1A1A1A',
      contrastText: '#FFFFFF'
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#333333',
      secondary: '#666666'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 700
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 700
    },
    h3: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600
    },
    h4: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600
    },
    h5: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 600
    },
    h6: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 600
    },
    subtitle1: {
      fontFamily: '"Roboto Condensed", sans-serif',
      fontWeight: 400
    },
    body1: {
      fontFamily: '"Roboto", sans-serif'
    },
    body2: {
      fontFamily: '"Roboto", sans-serif'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          fontWeight: 600,
          fontFamily: '"Montserrat", sans-serif',
          transition: 'all 0.3s ease-in-out'
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#CC8400',
            transform: 'translateY(-2px)'
          }
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.1)'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px'
        }
      }
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 768,
      lg: 1024,
      xl: 1536
    }
  }
});

export default theme; 