import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AppProvider } from './context/AppContext';
import { CartProvider } from './context/CartContext';
import theme from './theme';
import LoginPage from './pages/LoginPage';
import CustomerPage from './pages/CustomerPage';
import CartPage from './pages/CartPage';
import AdminPage from './pages/AdminPage';
import Layout from './components/Layout';

const App: React.FC = () => {
  return (
    <AppProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CartProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/menu" element={<CustomerPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/" element={<CustomerPage />} />
              </Routes>
            </Layout>
          </Router>
        </CartProvider>
      </ThemeProvider>
    </AppProvider>
  );
};

export default App;
