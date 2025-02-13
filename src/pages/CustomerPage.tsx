import React, { useState } from 'react';
import { 
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  useTheme,
  useMediaQuery,
  Fab,
  Typography
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import ItemList from '../components/ItemList';
import { CartProvider } from '../context/CartContext';
import { Categoria } from '../services/categoriaService';

const drawerWidth = 240;

const CustomerPage: React.FC = () => {
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCategoriaClick = (categoriaId: string | null) => {
    setSelectedCategoria(categoriaId);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleCategoriesLoaded = (loadedCategories: Categoria[]) => {
    setCategorias(loadedCategories);
  };

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <List>
        <ListItem sx={{ mb: 2 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: '"Playfair Display", serif',
              fontWeight: 600
            }}
          >
            Categorias
          </Typography>
        </ListItem>
        <ListItem>
          <ListItemButton 
            onClick={() => handleCategoriaClick(null)}
            selected={selectedCategoria === null}
            sx={{
              borderRadius: 2,
              mb: 1,
              justifyContent: 'flex-start',
              '&.Mui-selected': {
                bgcolor: 'primary.light',
                '&:hover': {
                  bgcolor: 'primary.light'
                }
              }
            }}
          >
            <ListItemText 
              primary="Todas" 
              primaryTypographyProps={{
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 500,
                color: selectedCategoria === null ? '#000000' : 'inherit'
              }}
            />
          </ListItemButton>
        </ListItem>
        {categorias.map((categoria) => (
          <ListItem key={categoria.id}>
            <ListItemButton
              onClick={() => handleCategoriaClick(categoria.id.toString())}
              selected={selectedCategoria === categoria.id.toString()}
              sx={{
                borderRadius: 2,
                mb: 1,
                justifyContent: 'flex-start',
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                  '&:hover': {
                    bgcolor: 'primary.light'
                  }
                }
              }}
            >
              <ListItemText 
                primary={categoria.nome}
                primaryTypographyProps={{
                  fontFamily: '"Montserrat", sans-serif',
                  fontWeight: 500,
                  color: selectedCategoria === categoria.id.toString() ? '#000000' : 'inherit'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <CartProvider>
      <Box sx={{ 
        display: 'flex',
        pt: 2,
        position: 'relative'
      }}>
        {/* Menu Lateral */}
        <Box
          component="nav"
          sx={{
            width: { md: drawerWidth },
            flexShrink: { md: 0 }
          }}
        >
          {/* Versão mobile do menu */}
          {isMobile && (
            <Fab
              color="primary"
              aria-label="open menu"
              onClick={handleDrawerToggle}
              sx={{
                position: 'fixed',
                bottom: 16,
                right: 16,
                zIndex: 1000
              }}
            >
              <MenuIcon />
            </Fab>
          )}
          
          {/* Menu drawer para mobile */}
          <Drawer
            variant={isMobile ? 'temporary' : 'permanent'}
            open={isMobile ? mobileOpen : true}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true
            }}
            sx={{
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                borderRight: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                position: 'relative',
                height: 'calc(100vh - 100px)',
                marginTop: '16px'
              }
            }}
          >
            {drawer}
          </Drawer>
        </Box>

        {/* Conteúdo Principal */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { md: `calc(100% - ${drawerWidth}px)` }
          }}
        >
          <ItemList 
            selectedCategoriaId={selectedCategoria}
            onCategoriesLoaded={handleCategoriesLoaded}
          />
        </Box>
      </Box>
    </CartProvider>
  );
};

export default CustomerPage;
