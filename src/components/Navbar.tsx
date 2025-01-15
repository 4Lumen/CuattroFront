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
  Badge as MuiBadge,
  Stack,
  Box,
  Typography
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
    <Stack 
      direction={{ xs: 'column', md: 'row' }} 
      spacing={{ xs: 1, md: 4 }}
      alignItems="center"
      width="100%"
    >
      {/* Links de Navegação */}
      <Stack 
        direction="row" 
        spacing={2}
        sx={{ 
          display: { xs: 'none', md: 'flex' },
          flex: 1,
          justifyContent: 'flex-start'
        }}
      >
        <Button
          component={Link}
          to="/"
          color="inherit"
          sx={{ 
            fontFamily: 'Montserrat',
            fontWeight: 500,
            fontSize: '0.95rem',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          Cardápio
        </Button>

        {state.user?.role === Role.Admin && (
          <Button
            component={Link}
            to="/admin"
            color="inherit"
            startIcon={<AdminPanelSettings />}
            sx={{ 
              fontFamily: 'Montserrat',
              fontWeight: 500,
              fontSize: '0.95rem',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            Administração
          </Button>
        )}

        {state.user?.role === Role.Funcionario && (
          <Button
            component={Link}
            to="/employee"
            color="inherit"
            startIcon={<BadgeIcon />}
            sx={{ 
              fontFamily: 'Montserrat',
              fontWeight: 500,
              fontSize: '0.95rem',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            Área do Funcionário
          </Button>
        )}
      </Stack>

      {/* Botões de Ação */}
      <Stack 
        direction="row" 
        spacing={2}
        alignItems="center"
      >
        {state.user ? (
          <>
            <IconButton 
              component={Link} 
              to="/cart" 
              color="inherit"
              sx={{
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)'
                }
              }}
            >
              <MuiBadge 
                badgeContent={state.cart?.itensCarrinho?.length || 0} 
                color="primary"
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: theme => theme.palette.primary.main,
                    color: theme => theme.palette.primary.contrastText
                  }
                }}
              >
                <ShoppingCart />
              </MuiBadge>
            </IconButton>

            <IconButton
              onClick={handleMenuOpen}
              size="small"
              sx={{
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)'
                }
              }}
            >
              {state.user.picture ? (
                <Avatar 
                  src={state.user.picture} 
                  alt={state.user.nome || ''} 
                  sx={{ width: 32, height: 32 }}
                />
              ) : (
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
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
              PaperProps={{
                elevation: 2,
                sx: {
                  mt: 1.5,
                  borderRadius: 2,
                  minWidth: 180
                }
              }}
            >
              <MenuItem onClick={() => handleNavigate('/profile')}>
                <ListItemIcon>
                  <Person fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Perfil"
                  primaryTypographyProps={{
                    fontFamily: 'Montserrat',
                    fontSize: '0.95rem'
                  }}
                />
              </MenuItem>

              {state.user.role === Role.Admin && (
                <MenuItem onClick={() => handleNavigate('/admin')}>
                  <ListItemIcon>
                    <AdminPanelSettings fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Administração"
                    primaryTypographyProps={{
                      fontFamily: 'Montserrat',
                      fontSize: '0.95rem'
                    }}
                  />
                </MenuItem>
              )}

              {state.user.role === Role.Funcionario && (
                <MenuItem onClick={() => handleNavigate('/employee')}>
                  <ListItemIcon>
                    <BadgeIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Área do Funcionário"
                    primaryTypographyProps={{
                      fontFamily: 'Montserrat',
                      fontSize: '0.95rem'
                    }}
                  />
                </MenuItem>
              )}

              <Divider />

              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <ExitToApp fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Sair"
                  primaryTypographyProps={{
                    fontFamily: 'Montserrat',
                    fontSize: '0.95rem'
                  }}
                />
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
            sx={{ 
              fontFamily: 'Montserrat',
              fontWeight: 500,
              fontSize: '0.95rem',
              px: 3,
              py: 1
            }}
          >
            Entrar
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

export default Navbar; 