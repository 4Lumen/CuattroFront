import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Button } from '@mui/material';
import { ShoppingCart, Person, ExitToApp, Login } from '@mui/icons-material';
import AuthService from '../services/authService';

const Navbar: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      dispatch({ type: 'SET_USER', payload: null });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo e Nome */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="Cuattro" className="h-8 w-auto" />
            <span className="text-xl font-bold text-gray-800">Cuattro</span>
          </Link>

          {/* Links de Navegação */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium">
              Cardápio
            </Link>
            {state.user?.role === 2 && (
              <Link to="/admin" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium">
                Admin
              </Link>
            )}
            {state.user?.role === 1 && (
              <Link to="/employee" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium">
                Funcionário
              </Link>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center space-x-4">
            {state.user ? (
              <>
                <Link to="/cart" className="text-gray-600 hover:text-gray-800">
                  <ShoppingCart />
                </Link>
                <Link to="/profile" className="text-gray-600 hover:text-gray-800">
                  <Person />
                </Link>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<ExitToApp />}
                  onClick={handleLogout}
                  size="small"
                >
                  Sair
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                color="primary"
                startIcon={<Login />}
                component={Link}
                to="/login"
                size="small"
              >
                Entrar
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 