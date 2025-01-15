import React, { ReactNode } from 'react';
import { Box, Container, AppBar, Toolbar } from '@mui/material';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: 'background.default',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <AppBar 
        position="sticky" 
        color="inherit" 
        elevation={0}
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar 
            disableGutters 
            sx={{ 
              flexDirection: { xs: 'column', md: 'row' },
              py: { xs: 2, md: 2 },
              gap: { xs: 2, md: 2 },
              minHeight: { xs: 'auto' }
            }}
          >
            <Box 
              component="img"
              src="/cuattrolivedigital_logo.jpg"
              alt="Logo"
              sx={{
                height: { xs: '40px', md: '50px' },
                width: 'auto',
                objectFit: 'contain'
              }}
            />
            <Box sx={{ width: '100%' }}>
              <Navbar />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Container 
        component="main" 
        maxWidth="lg" 
        sx={{ 
          flex: 1,
          pt: { xs: 2, md: 4 },
          pb: { xs: 4, md: 6 }
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default Layout; 