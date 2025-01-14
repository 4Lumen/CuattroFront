import React, { useEffect, useState, useCallback } from 'react';
import { Grid, Container, CircularProgress, Alert, Button } from '@mui/material';
import { useCart } from '../hooks/useCart';
import { useAppContext } from '../context/AppContext';
import { Item } from '../types';
import itemService from '../services/itemService';
import MenuFilter from '../components/MenuFilter';
import MenuItem from '../components/MenuItem';
import { AxiosError } from 'axios';

const CustomerPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const { state, dispatch } = useAppContext();
  const { addToCart, removeFromCart, getItemQuantity } = useCart();

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await itemService.getItems();
      if (Array.isArray(items)) {
        dispatch({ type: 'SET_ITEMS', payload: items });
      } else {
        throw new Error('Formato de dados inválido');
      }
    } catch (error) {
      console.error('Erro ao buscar itens:', error);
      if (error instanceof AxiosError) {
        if (error.code === 'ECONNABORTED') {
          setError('A conexão expirou. Por favor, tente novamente.');
        } else if (error.response) {
          setError(`Erro ${error.response.status}: ${error.response.data.message || 'Erro desconhecido'}`);
        } else if (error.request) {
          setError('Não foi possível conectar ao servidor. Verifique sua conexão.');
        } else {
          setError(error.message);
        }
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Erro ao carregar os itens. Por favor, tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const filteredItems = selectedCategory === 'Todos'
    ? state.items
    : state.items.filter(item => item.categoria === selectedCategory);

  const handleAddToCart = async (item: Item) => {
    try {
      setError(null);
      await addToCart(item, 1);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Erro ao adicionar item ao carrinho');
      }
    }
  };

  const handleRemoveFromCart = async (itemId: number) => {
    try {
      setError(null);
      await removeFromCart(itemId);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Erro ao remover item do carrinho');
      }
    }
  };

  if (loading) {
    return (
      <Container className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      {error && (
        <Alert 
          severity="error" 
          className="mb-4" 
          action={
            <Button color="inherit" size="small" onClick={fetchItems}>
              Tentar Novamente
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <MenuFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </Grid>
        <Grid item xs={12} md={9}>
          <Grid container spacing={3}>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <MenuItem
                    item={item}
                    quantity={getItemQuantity(item.id)}
                    onAdd={() => handleAddToCart(item)}
                    onRemove={() => handleRemoveFromCart(item.id)}
                  />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Alert 
                  severity="info"
                  action={
                    error && (
                      <Button color="inherit" size="small" onClick={fetchItems}>
                        Tentar Novamente
                      </Button>
                    )
                  }
                >
                  {error ? 'Não foi possível carregar os itens.' : 'Nenhum item encontrado nesta categoria.'}
                </Alert>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CustomerPage;
