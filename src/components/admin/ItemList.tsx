import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import ItemService from '../../services/itemService';
import { MenuItem, CreateMenuItem } from './MenuConfiguration';
import ItemFormDialog from './ItemFormDialog';
import CategoriaService, { Categoria } from '../../services/categoriaService';

const ItemList: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | undefined>(undefined);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      // Primeiro carrega todas as categorias
      const categorias = await CategoriaService.getCategorias();
      console.log('Categorias carregadas:', categorias);

      // Depois carrega os itens
      const fetchedItems = await ItemService.getItems();
      console.log('Itens carregados:', fetchedItems);
      
      // Associa as categorias corretas aos itens
      const menuItems = fetchedItems.map(item => {
        //console.log('Processando item:', item.nome, 'com categoria:', item.categoria, 'e categoriaId:', item.categoriaId);
        
        // Primeiro tenta pelo categoriaId
        if (item.categoriaId) {
          const categoria = categorias.find(c => c.id === item.categoriaId);
          if (categoria) {
            console.log(`Categoria encontrada por ID ${item.categoriaId} para o item ${item.nome}:`, categoria);
            return {
              ...item,
              categoria: categoria.nome,
              unidadeMedida: item.unidadeMedida || '',
              quantidade: item.quantidade || 0,
              disponivel: item.disponivel ?? true,
              destaque: item.destaque ?? false,
              ordem: item.ordem ?? 0,
              tags: item.tags || []
            };
          }
        }
        
        // Se não achou por ID, tenta pelo objeto categoria
        if (item.categoria && typeof item.categoria === 'object' && 'id' in item.categoria) {
          const categoriaId = item.categoria.id;
          const categoria = categorias.find(c => c.id === categoriaId);
          if (categoria) {
            console.log(`Categoria encontrada por ID para o item ${item.nome}:`, categoria);
            return {
              ...item,
              categoria: categoria.nome,
              unidadeMedida: item.unidadeMedida || '',
              quantidade: item.quantidade || 0,
              disponivel: item.disponivel ?? true,
              destaque: item.destaque ?? false,
              ordem: item.ordem ?? 0,
              tags: item.tags || []
            };
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
            return { ...item, categoria: categoria.nome };
          }
        }
        
        // Se não encontrou categoria válida
        console.log(`Usando categoria padrão para o item ${item.nome}`);
        return { ...item, categoria: 'Sem Categoria' };
      });

      console.log('Itens com categorias processados:', menuItems);
      setItems(menuItems);
      setError(null);
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
      setError('Erro ao carregar os itens. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setSelectedItem(undefined);
    setIsFormOpen(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleDeleteItem = async (id: number) => {
    try {
      await ItemService.deleteItem(id);
      await fetchItems();
      setError(null);
    } catch (error) {
      console.error('Erro ao excluir item:', error);
      setError('Erro ao excluir o item. Por favor, tente novamente.');
    }
  };

  const handleFormSubmit = async (formData: CreateMenuItem | MenuItem) => {
    try {
      // Se a categoria é uma string, tenta encontrar ou criar a categoria
      if (typeof formData.categoria === 'string') {
        const categoria = await CategoriaService.getOrCreateCategoria(formData.categoria);
        formData = {
          ...formData,
          categoria,
          categoriaId: categoria.id
        };
      }

      if ('id' in formData) {
        await ItemService.updateItem(formData);
      } else {
        await ItemService.createItem(formData);
      }
      await fetchItems();
      setIsFormOpen(false);
      setError(null);
    } catch (error) {
      console.error('Erro ao salvar item:', error);
      setError('Erro ao salvar o item. Por favor, tente novamente.');
    }
  };

  const getCategoriaDisplay = (categoria: string | Categoria | undefined): string => {
    if (!categoria) {
      return 'Sem Categoria';
    }
    
    if (typeof categoria === 'string') {
      return categoria;
    }
    
    if ('nome' in categoria) {
      return categoria.nome;
    }
    
    return 'Sem Categoria';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Gerenciar Menu
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddItem}
        >
          Adicionar Item
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Un. Medida</TableCell>
              <TableCell>Qtd.</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.nome}</TableCell>
                <TableCell>{item.descricao}</TableCell>
                <TableCell>R$ {item.preco.toFixed(2)}</TableCell>
                <TableCell>{item.unidadeMedida}</TableCell>
                <TableCell align="center">{item.quantidade}</TableCell>
                <TableCell>{getCategoriaDisplay(item.categoria)}</TableCell>
                <TableCell>
                  {item.disponivel ? (
                    <Chip label="Disponível" color="success" size="small" />
                  ) : (
                    <Chip label="Indisponível" color="error" size="small" />
                  )}
                  {item.destaque && (
                    <Chip
                      label="Destaque"
                      color="primary"
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  )}
                </TableCell>
                <TableCell align="right">
                  <Button
                    color="primary"
                    onClick={() => handleEditItem(item)}
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button
                    color="error"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ItemFormDialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        item={selectedItem}
      />
    </Box>
  );
};

export default ItemList; 