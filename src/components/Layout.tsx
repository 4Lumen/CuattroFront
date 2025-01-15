import React, { ReactNode } from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Box component="main" sx={{ pt: 2 }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 