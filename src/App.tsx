import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import CustomerPage from './pages/CustomerPage';
import AdminPage from './pages/AdminPage';
import EmployeePage from './pages/EmployeePage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAppContext } from './context/AppContext';
import { CartProvider } from './context/CartContext';
import AuthService from './services/authService';
import './App.css';

const Navigation: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await AuthService.logout();
    dispatch({ type: 'SET_USER', payload: null });
    navigate('/');
  };

  return (
    <nav>
      <h1>Buffet Ordering System</h1>
      <ul>
        <li><Link to="/">Customer</Link></li>
        {state.user ? (
          <>
            {state.user.role === 1 && <li><Link to="/admin">Admin</Link></li>}
            {state.user.role === 2 && <li><Link to="/employee">Employee</Link></li>}
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <li><Link to="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="App">
          <Navigation />
          
          <Routes>
            <Route path="/" element={<CustomerPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole={1}>
                  <AdminPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/employee" 
              element={
                <ProtectedRoute requiredRole={2}>
                  <EmployeePage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
