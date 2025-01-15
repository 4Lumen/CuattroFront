import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  CircularProgress,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  useTheme,
  useMediaQuery,
  Fab,
  Dialog,
  IconButton,
  AppBar,
  Toolbar,
  Slide,
  Chip,
  Stack as MuiStack
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { Menu as MenuIcon, Close as CloseIcon, Remove as RemoveIcon, Add as AddIcon } from '@mui/icons-material';
import { useCart } from '../hooks/useCart';
import { Item } from '../services/itemService';
import ItemService from '../services/itemService';
import MenuItem from '../components/MenuItem';
import categoriaService, { Categoria } from '../services/categoriaService';

const drawerWidth = 240;

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CustomerPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [quickViewItem, setQuickViewItem] = useState<Item | null>(null);
  const { addToCart, removeFromCart, items: cartItems } = useCart();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // Primeiro carrega todas as categorias
        console.log('Iniciando carregamento das categorias...');
        const categorias = await categoriaService.getCategorias();
        console.log('Categorias carregadas:', categorias);

        if (!categorias || categorias.length === 0) {
          console.warn('Nenhuma categoria foi carregada do backend, usando categoria padrão');
        }

        // Depois carrega os itens
        console.log('Iniciando carregamento dos itens...');
        const fetchedItems = await ItemService.getItems();
        console.log('Itens carregados:', fetchedItems);
        
        // Associa as categorias corretas aos itens
        const itemsWithCategories = fetchedItems.map(item => {
          console.log('Processando item:', item.nome, 'com categoria:', item.categoria, 'e categoriaId:', item.categoriaId);
          
          // Primeiro tenta pelo categoriaId
          if (item.categoriaId) {
            const categoria = categorias.find(c => c.id === item.categoriaId);
            if (categoria) {
              console.log(`Categoria encontrada por ID ${item.categoriaId} para o item ${item.nome}:`, categoria);
              return { ...item, categoria };
            }
          }
          
          // Se não achou por ID, tenta pelo objeto categoria
          if (item.categoria && typeof item.categoria === 'object' && 'id' in item.categoria) {
            const categoriaId = item.categoria.id;
            const categoria = categorias.find(c => c.id === categoriaId);
            if (categoria) {
              console.log(`Categoria encontrada por ID para o item ${item.nome}:`, categoria);
              return { ...item, categoria };
            }
          }
          
          // Se não achou por ID, tenta pelo nome
          if (item.categoria && typeof item.categoria === 'string') {
            const categoriaNome = item.categoria;
            const categoria = categorias.find(c => 
              c.nome && c.nome.toLowerCase() === categoriaNome.toLowerCase()
            );
            if (categoria) {
              console.log(`Categoria encontrada por nome para o item ${item.nome}:`, categoria);
              return { ...item, categoria };
            }
          }
          
          // Se não encontrou categoria válida
          const categoriaDefault = { 
            id: 0, 
            nome: 'Sem Categoria', 
            descricao: 'Sem Categoria', 
            ordem: 0, 
            ativa: true 
          };
          console.log(`Usando categoria padrão para o item ${item.nome}:`, categoriaDefault);
          return { ...item, categoria: categoriaDefault };
        });
        
        // Ordena os itens por categoria e nome
        const itemsOrdenados = itemsWithCategories.sort((a, b) => {
          const catA = getCategoriaDisplay(a.categoria).toLowerCase();
          const catB = getCategoriaDisplay(b.categoria).toLowerCase();
          if (catA === catB) {
            return a.nome.localeCompare(b.nome);
          }
          if (catA === 'sem categoria') return 1;
          if (catB === 'sem categoria') return -1;
          return catA.localeCompare(catB);
        });
        
        console.log('Itens com categorias processados:', itemsOrdenados);
        setItems(itemsOrdenados);
        setError(null);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Erro ao carregar os itens. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleAddToCart = (item: Item) => {
    try {
      addToCart(item);
    } catch (error) {
      console.error('Erro ao adicionar item ao carrinho:', error);
      setError('Erro ao adicionar item ao carrinho. Por favor, tente novamente.');
    }
  };

  const handleRemoveFromCart = (itemId: number) => {
    try {
      removeFromCart(itemId);
    } catch (error) {
      console.error('Erro ao remover item do carrinho:', error);
      setError('Erro ao remover item do carrinho. Por favor, tente novamente.');
    }
  };

  const getItemQuantityInCart = (itemId: number): number => {
    const cartItem = cartItems.find(item => item.item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const getCategoriaDisplay = (categoria: string | Categoria | undefined): string => {
    if (!categoria) {
      console.log('Categoria undefined, retornando "Sem Categoria"');
      return 'Sem Categoria';
    }
    
    if (typeof categoria === 'string') {
      console.log('Categoria é string:', categoria);
      return categoria;
    }
    
    if ('nome' in categoria && categoria.nome) {
      console.log('Categoria é objeto com nome:', categoria.nome);
      return categoria.nome;
    }
    
    console.log('Categoria inválida:', categoria);
    return 'Sem Categoria';
  };

  const getCategoriaId = (categoria: string | Categoria | undefined): string => {
    if (!categoria) {
      return 'sem-categoria';
    }
    
    if (typeof categoria === 'string') {
      return categoria.toLowerCase();
    }
    
    if ('id' in categoria && categoria.id !== undefined) {
      return categoria.id.toString();
    }
    
    return 'sem-categoria';
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCategoriaClick = (categoriaKey: string | null) => {
    setSelectedCategoria(categoriaKey);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleQuickView = (item: Item) => {
    setQuickViewItem(item);
  };

  const handleCloseQuickView = () => {
    setQuickViewItem(null);
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Box>
    );
  }

  // Agrupa os itens por categoria
  const categoriaMap = new Map<string, Item[]>();
  items.forEach(item => {
    const categoriaKey = getCategoriaId(item.categoria);
    if (!categoriaMap.has(categoriaKey)) {
      categoriaMap.set(categoriaKey, []);
    }
    categoriaMap.get(categoriaKey)?.push(item);
  });

  const categorias = Array.from(categoriaMap.entries());
  const filteredCategorias = selectedCategoria 
    ? categorias.filter(([key]) => key === selectedCategoria)
    : categorias;

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
                color: selectedCategoria === null ? 'primary.main' : 'inherit'
              }}
            />
          </ListItemButton>
        </ListItem>
        {categorias.map(([categoriaKey, categoriaItems]) => (
          <ListItem key={categoriaKey}>
            <ListItemButton
              onClick={() => handleCategoriaClick(categoriaKey)}
              selected={selectedCategoria === categoriaKey}
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
                primary={getCategoriaDisplay(categoriaItems[0]?.categoria)}
                primaryTypographyProps={{
                  fontFamily: '"Montserrat", sans-serif',
                  fontWeight: 500,
                  color: selectedCategoria === categoriaKey ? 'primary.main' : 'inherit'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
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
            keepMounted: true // Melhor performance em mobile
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper'
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
        {filteredCategorias.map(([categoriaKey, categoriaItems]) => (
          <Box key={categoriaKey} sx={{ mb: 6 }}>
            <Typography 
              variant="h4" 
              component="h2" 
              gutterBottom 
              sx={{ 
                mb: 4,
                fontFamily: '"Playfair Display", serif',
                fontWeight: 600
              }}
            >
              {getCategoriaDisplay(categoriaItems[0]?.categoria)}
            </Typography>
            <Grid container spacing={3}>
              {categoriaItems.map(item => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <MenuItem
                    item={item}
                    onAdd={() => handleAddToCart(item)}
                    onRemove={() => handleRemoveFromCart(item.id)}
                    quantity={getItemQuantityInCart(item.id)}
                    onQuickView={() => handleQuickView(item)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Box>

      {/* Modal de Visualização Rápida */}
      <Dialog
        fullScreen={isMobile}
        open={quickViewItem !== null}
        onClose={handleCloseQuickView}
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            maxWidth: 'md',
            maxHeight: '90vh'
          }
        }}
      >
        {quickViewItem && (
          <>
            {isMobile && (
              <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={handleCloseQuickView}
                    aria-label="close"
                  >
                    <CloseIcon />
                  </IconButton>
                  <Typography 
                    sx={{ 
                      ml: 2, 
                      flex: 1,
                      fontFamily: '"Playfair Display", serif'
                    }}
                    variant="h6"
                  >
                    {quickViewItem.nome}
                  </Typography>
                </Toolbar>
              </AppBar>
            )}
            <Box sx={{ p: { xs: 2, md: 4 } }}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  {quickViewItem.imagemUrl && (
                    <Box
                      component="img"
                      src={quickViewItem.imagemUrl}
                      alt={quickViewItem.nome}
                      sx={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: 2,
                        boxShadow: 1
                      }}
                    />
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <MuiStack spacing={3}>
                    {quickViewItem.categoria && (
                      <Chip
                        label={typeof quickViewItem.categoria === 'string' 
                          ? quickViewItem.categoria 
                          : quickViewItem.categoria.nome
                        }
                        size="small"
                        sx={{
                          alignSelf: 'flex-start',
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                          fontFamily: '"Roboto Condensed", sans-serif'
                        }}
                      />
                    )}
                    <Typography 
                      variant="h4"
                      sx={{
                        fontFamily: '"Playfair Display", serif',
                        fontWeight: 600
                      }}
                    >
                      {quickViewItem.nome}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        fontFamily: '"Roboto", sans-serif',
                        fontSize: '1rem',
                        lineHeight: 1.7
                      }}
                    >
                      {quickViewItem.descricao}
                    </Typography>
                    <Typography 
                      variant="h4"
                      sx={{
                        fontFamily: '"Montserrat", sans-serif',
                        fontWeight: 600,
                        color: 'primary.main'
                      }}
                    >
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(quickViewItem.preco)}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <MuiStack 
                        direction="row" 
                        spacing={2} 
                        alignItems="center"
                      >
                        <IconButton 
                          onClick={() => handleRemoveFromCart(quickViewItem.id)}
                          disabled={getItemQuantityInCart(quickViewItem.id) === 0}
                          sx={{
                            color: 'primary.main',
                            bgcolor: 'primary.light',
                            '&:hover': {
                              bgcolor: 'primary.light',
                              transform: 'scale(1.1)'
                            }
                          }}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography 
                          sx={{ 
                            fontFamily: '"Montserrat", sans-serif',
                            fontWeight: 600,
                            minWidth: 40,
                            textAlign: 'center'
                          }}
                        >
                          {getItemQuantityInCart(quickViewItem.id)}
                        </Typography>
                        <IconButton 
                          onClick={() => handleAddToCart(quickViewItem)}
                          sx={{
                            color: 'primary.main',
                            bgcolor: 'primary.light',
                            '&:hover': {
                              bgcolor: 'primary.light',
                              transform: 'scale(1.1)'
                            }
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      </MuiStack>
                    </Box>
                  </MuiStack>
                </Grid>
              </Grid>
            </Box>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default CustomerPage;
