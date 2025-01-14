import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { 
  Button, 
  Menu, 
  MenuItem, 
  Avatar, 
  IconButton, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Badge as MuiBadge
} from '@mui/material';
import { 
  ShoppingCart, 
  Person, 
  ExitToApp, 
  Login, 
  AdminPanelSettings,
  Badge as BadgeIcon
} from '@mui/icons-material';
import AuthService from '../services/authService';
import { Role } from '../types';

const Navbar: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    console.log('Estado atual do usuário:', state.user);
    if (state.user) {
      console.log('Role do usuário:', {
        roleValue: state.user.role,
        isAdmin: state.user.role === Role.Admin,
        isFuncionario: state.user.role === Role.Funcionario,
        roleEnum: Role
      });
    }
  }, [state.user]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    console.log('Abrindo menu do usuário:', state.user);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      dispatch({ type: 'SET_USER', payload: null });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
    handleMenuClose();
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleMenuClose();
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
            {state.user?.role === Role.Admin && (
              <Link 
                to="/admin" 
                className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <AdminPanelSettings className="mr-1" fontSize="small" />
                Administração
              </Link>
            )}
            {state.user?.role === Role.Funcionario && (
              <Link 
                to="/employee" 
                className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <BadgeIcon className="mr-1" fontSize="small" />
                Área do Funcionário
              </Link>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center space-x-4">
            {state.user ? (
              <>
                <Link to="/cart" className="text-gray-600 hover:text-gray-800">
                  <IconButton color="inherit">
                    <MuiBadge 
                      badgeContent={state.cart?.itensCarrinho?.length || 0} 
                      color="primary"
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                    >
                      <ShoppingCart />
                    </MuiBadge>
                  </IconButton>
                </Link>
                <IconButton
                  onClick={handleMenuOpen}
                  size="small"
                  aria-controls={Boolean(anchorEl) ? 'profile-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
                >
                  {state.user.picture ? (
                    <Avatar 
                      src={state.user.picture} 
                      alt={state.user.nome || ''} 
                      sx={{ width: 32, height: 32 }}
                    />
                  ) : (
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {state.user.nome?.charAt(0) || 'U'}
                    </Avatar>
                  )}
                </IconButton>
                <Menu
                  id="profile-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  onClick={handleMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={() => handleNavigate('/profile')}>
                    <ListItemIcon>
                      <Person fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Perfil" />
                  </MenuItem>

                  {state.user.role === Role.Admin && (
                    <MenuItem onClick={() => handleNavigate('/admin')}>
                      <ListItemIcon>
                        <AdminPanelSettings fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Administração" />
                    </MenuItem>
                  )}

                  {state.user.role === Role.Funcionario && (
                    <MenuItem onClick={() => handleNavigate('/employee')}>
                      <ListItemIcon>
                        <BadgeIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Área do Funcionário" />
                    </MenuItem>
                  )}

                  <Divider />

                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <ExitToApp fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Sair" />
                  </MenuItem>
                </Menu>
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