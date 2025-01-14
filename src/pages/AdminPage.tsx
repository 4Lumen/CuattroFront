import React from 'react';
import { Container, Typography } from '@mui/material';

const AdminPage: React.FC = () => {
  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h4" component="h1" className="mb-6">
        Painel do Administrador
      </Typography>
      
      {/* TODO: Implementar funcionalidades do administrador */}
      <Typography variant="body1" color="text.secondary">
        Esta página está em desenvolvimento.
      </Typography>
    </Container>
  );
};

export default AdminPage;
