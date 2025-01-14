import React from 'react';
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import CustomerPage from '../pages/CustomerPage';
import LoginPage from '../pages/LoginPage';
import AdminPage from '../pages/AdminPage';
import EmployeePage from '../pages/EmployeePage';

const Routes: React.FC = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<CustomerPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/employee" element={<EmployeePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </RouterRoutes>
  );
};

export default Routes; 