import React, { useEffect, useState } from 'react';
import { 
  ToggleButton, 
  ToggleButtonGroup,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Grid,
  Chip,
  Stack as MuiStack,
  useTheme,
  useMediaQuery,
  Slide,
  TextField
} from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { TransitionProps } from '@mui/material/transitions';
import ItemCard from './ItemCard';
import ItemService, { Item } from '../services/itemService';
import categoriaService, { Categoria } from '../services/categoriaService';
import { useCart } from '../hooks/useCart';

interface ItemListProps {
  selectedCategoriaId: string | null;
  onCategoriesLoaded?: (categories: Categoria[]) => void;
}

const { getItems } = ItemService;

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const getCategoriaDisplay = (categoria: string | Categoria | undefined): string => {
  if (!categoria) {
    return 'Sem Categoria';
  }
  
  if (typeof categoria === 'string') {
    return categoria;
  }
  
  if ('nome' in categoria && categoria.nome) {
    return categoria.nome;
  }
  
  return 'Sem Categoria';
};

const ItemList: React.FC<ItemListProps> = ({ selectedCategoriaId, onCategoriesLoaded }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [quickViewItem, setQuickViewItem] = useState<Item | null>(null);
  const { items: cartItems, addToCart, decrementFromCart } = useCart();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const getItemQuantity = (itemId: number) => {
    const cartItem = cartItems.find(item => item.item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleQuantityChange = (item: Item, value: string) => {
    const newQuantity = parseInt(value, 10);
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      const currentQuantity = getItemQuantity(item.id);
      if (newQuantity > currentQuantity) {
        // Add items to reach the new quantity
        for (let i = 0; i < newQuantity - currentQuantity; i++) {
          addToCart(item);
        }
      } else if (newQuantity < currentQuantity) {
        // Remove items to reach the new quantity
        for (let i = 0; i < currentQuantity - newQuantity; i++) {
          decrementFromCart(item.id);
        }
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categorias, fetchedItems] = await Promise.all([
          categoriaService.getCategorias(),
          ItemService.getItems()
        ]);

        if (!categorias || categorias.length === 0) {
          console.warn('Nenhuma categoria foi carregada do backend');
        }

        // Process items with categories
        const itemsWithCategories = fetchedItems.map(item => {
          // Try by categoriaId first
          if (item.categoriaId) {
            const categoria = categorias.find(c => c.id === item.categoriaId);
            if (categoria) {
              return { ...item, categoria };
            }
          }
          
          // Try by categoria object
          if (item.categoria && typeof item.categoria === 'object' && 'id' in item.categoria) {
            const categoriaId = item.categoria.id;
            const categoria = categorias.find(c => c.id === categoriaId);
            if (categoria) {
              return { ...item, categoria };
            }
          }
          
          // Try by categoria name
          if (item.categoria && typeof item.categoria === 'string') {
            const categoriaNome = item.categoria;
            const categoria = categorias.find(c => 
              c.nome && c.nome.toLowerCase() === categoriaNome.toLowerCase()
            );
            if (categoria) {
              return { ...item, categoria };
            }
          }
          
          // Use default category if none found
          const categoriaDefault = { 
            id: 0, 
            nome: 'Sem Categoria', 
            descricao: 'Sem Categoria', 
            ordem: 0, 
            ativa: true 
          };
          return { ...item, categoria: categoriaDefault };
        });

        // Sort items by category and name
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

        // Get unique categories that have items
        const uniqueCategories = Array.from(
          new Set(
            itemsOrdenados
              .map(item => {
                if (typeof item.categoria === 'object' && item.categoria) {
                  return item.categoria;
                }
                return null;
              })
              .filter((cat): cat is Categoria => cat !== null)
          )
        ).sort((a, b) => a.nome.localeCompare(b.nome));

        setItems(itemsOrdenados);
        if (onCategoriesLoaded) {
          onCategoriesLoaded(uniqueCategories);
        }
      } catch (err) {
        setError('Failed to load items');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [onCategoriesLoaded]);

  const filteredItems = React.useMemo(() => {
    if (!selectedCategoriaId) return items;
    return items.filter(item => {
      if (typeof item.categoria === 'object' && item.categoria) {
        return item.categoria.id.toString() === selectedCategoriaId;
      }
      return false;
    });
  }, [items, selectedCategoriaId]);

  const handleViewChange = (
    _event: React.MouseEvent<HTMLElement>,
    newView: 'grid' | 'list' | null
  ) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  const handleQuickView = (item: Item) => {
    setQuickViewItem(item);
  };

  const handleCloseQuickView = () => {
    setQuickViewItem(null);
  };

  const renderListView = () => (
    <div className="flex flex-col space-y-2">
      {filteredItems.map(item => (
        <div 
          key={item.id} 
          className="flex justify-between items-center p-4 border rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-4px]"
        >
          <div className="flex items-center flex-1 space-x-4">
            {item.imagemUrl && (
              <img 
                src={item.imagemUrl} 
                alt={item.nome}
                className="w-16 h-16 object-cover rounded"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                {item.categoria && (
                  <Chip
                    label={getCategoriaDisplay(item.categoria)}
                    size="small"
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      fontFamily: '"Roboto Condensed", sans-serif',
                    }}
                  />
                )}
                <h3 className="text-lg font-semibold font-playfair">{item.nome}</h3>
              </div>
              <span className="text-primary font-montserrat font-semibold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(item.preco)}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <IconButton
              onClick={() => decrementFromCart(item.id)}
              disabled={getItemQuantity(item.id) === 0}
            >
              <RemoveIcon />
            </IconButton>
            <TextField
              type="number"
              value={getItemQuantity(item.id)}
              onChange={(e) => handleQuantityChange(item, e.target.value)}
              inputProps={{
                min: 0,
                style: { 
                  textAlign: 'center',
                  width: '60px',
                  padding: '8px'
                }
              }}
              variant="outlined"
              size="small"
            />
            <IconButton
              onClick={() => addToCart(item)}
              sx={{ 
                p: 1,
                bgcolor: 'transparent',
                '&:hover': {
                  bgcolor: 'transparent'
                }
              }}
            >
              <AddIcon />
            </IconButton>
          </div>
        </div>
      ))}
    </div>
  );

  const renderGridView = () => (
    <Grid container spacing={3}>
      {filteredItems.map(item => (
        <Grid item xs={12} sm={6} md={4} key={item.id}>
          <ItemCard
            key={item.id}
            item={item}
            quantity={getItemQuantity(item.id)}
            onAddToCart={() => addToCart(item)}
            onRemoveFromCart={() => decrementFromCart(item.id)}
            onQuickView={() => handleQuickView(item)}
          />
        </Grid>
      ))}
    </Grid>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-end">
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewChange}
          aria-label="view mode"
        >
          <ToggleButton 
            value="grid" 
            aria-label="grid view"
            sx={{
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  bgcolor: 'primary.dark',
                }
              }
            }}
          >
            <GridViewIcon />
          </ToggleButton>
          <ToggleButton 
            value="list" 
            aria-label="list view"
            sx={{
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  bgcolor: 'primary.dark',
                }
              }
            }}
          >
            <ViewListIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      {viewMode === 'grid' ? renderGridView() : renderListView()}

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
                  <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
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
                        label={getCategoriaDisplay(quickViewItem.categoria)}
                        size="small"
                        sx={{
                          alignSelf: 'flex-start',
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText'
                        }}
                      />
                    )}
                    <Typography variant="h4" gutterBottom>
                      {quickViewItem.nome}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {quickViewItem.descricao}
                    </Typography>
                    <Typography variant="h5" color="primary">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(quickViewItem.preco)}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <TextField
                        type="number"
                        value={getItemQuantity(quickViewItem.id)}
                        onChange={(e) => handleQuantityChange(quickViewItem, e.target.value)}
                        inputProps={{
                          min: 0,
                          style: { textAlign: 'center', width: '60px' }
                        }}
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                  </MuiStack>
                </Grid>
              </Grid>
            </Box>
          </>
        )}
      </Dialog>
    </div>
  );
};

export default ItemList;
