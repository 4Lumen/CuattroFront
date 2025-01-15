import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, CircularProgress } from '@mui/material';
import { useCart } from '../hooks/useCart';
import { Item } from '../services/itemService';
import ItemService from '../services/itemService';
import MenuItem from '../components/MenuItem';
import categoriaService, { Categoria } from '../services/categoriaService';

const CustomerPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, removeFromCart, items: cartItems } = useCart();

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

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
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

  return (
    <Container>
      {Array.from(categoriaMap.entries()).map(([categoriaKey, categoriaItems]) => (
        <div key={categoriaKey}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
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
                />
              </Grid>
            ))}
          </Grid>
        </div>
      ))}
    </Container>
  );
};

export default CustomerPage;
