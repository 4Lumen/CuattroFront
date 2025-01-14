import React from 'react';
import { Container, Typography } from '@mui/material';

const EmployeePage: React.FC = () => {
  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h4" component="h1" className="mb-6">
        Painel do Funcionário
      </Typography>
      
      {/* TODO: Implementar funcionalidades do funcionário */}
      <Typography variant="body1" color="text.secondary">
        Esta página está em desenvolvimento.
      </Typography>
    </Container>
  );
};

export default EmployeePage;
