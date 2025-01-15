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
  Alert
} from '@mui/material';
import ItemService, { Item } from '../../../services/itemService';
import { MenuItem, CreateMenuItem } from '../MenuConfiguration';
import ItemFormDialog from '../ItemFormDialog';
import CategoriaService, { Categoria } from '../../../services/categoriaService';

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
      console.log('Categorias disponíveis:', categorias.map(c => ({
        id: c.id,
        tipo: typeof c.id,
        nome: c.nome
      })));

      // Depois carrega os itens
      const fetchedItems = await ItemService.getItems();
      console.log('Itens carregados:', fetchedItems.map(item => ({
        nome: item.nome,
        categoriaId: item.categoriaId,
        tipoCategoriaId: typeof item.categoriaId
      })));
      
      // Associa as categorias corretas aos itens
      const menuItems = fetchedItems.map(item => {
        console.log('\n=== Processando item:', item.nome, '===');
        console.log('categoriaId:', item.categoriaId, '(tipo:', typeof item.categoriaId, ')');
        
        // Primeiro tenta pelo categoriaId
        if (item.categoriaId !== undefined && item.categoriaId !== null) {
          console.log('Tentando encontrar categoria com ID:', item.categoriaId);
          console.log('Categorias disponíveis:', categorias.map(c => ({
            id: c.id,
            tipo: typeof c.id,
            nome: c.nome
          })));
          
          const itemCategoriaId = Number(item.categoriaId);
          const categoria = categorias.find(c => {
            const categoriaId = Number(c.id);
            const match = categoriaId === itemCategoriaId;
            console.log(`Comparando com categoria "${c.nome}":`, {
              categoriaId,
              itemCategoriaId,
              match
            });
            return match;
          });

          if (categoria) {
            console.log('✅ Categoria encontrada:', categoria.nome);
            return { ...item, categoria };
          } else {
            console.log('❌ Nenhuma categoria encontrada com ID:', item.categoriaId);
          }
        } else {
          console.log('❌ Item não tem categoriaId definido');
        }
        
        // Se não achou por ID, tenta pelo objeto categoria
        if (item.categoria && typeof item.categoria === 'object' && 'id' in item.categoria) {
          const categoriaId = Number(item.categoria.id);
          console.log('Tentando encontrar categoria pelo objeto.id:', categoriaId);
          const categoria = categorias.find(c => Number(c.id) === categoriaId);
          if (categoria) {
            console.log('✅ Categoria encontrada pelo objeto:', categoria.nome);
            return { ...item, categoria };
          }
        }
        
        // Se não achou por ID, tenta pelo nome
        if (item.categoria && typeof item.categoria === 'string') {
          const categoriaNome = item.categoria;
          console.log('Tentando encontrar categoria pelo nome:', categoriaNome);
          const categoria = categorias.find(c => 
            c.nome && c.nome.toLowerCase() === categoriaNome.toLowerCase()
          );
          if (categoria) {
            console.log('✅ Categoria encontrada pelo nome:', categoria.nome);
            return { ...item, categoria };
          }
        }
        
        // Se não encontrou categoria válida
        console.log('❌ Nenhuma categoria válida encontrada, usando padrão');
        const categoriaDefault = { 
          id: 0, 
          nome: 'Sem Categoria', 
          descricao: 'Sem Categoria', 
          ordem: 0, 
          ativa: true 
        };
        return { ...item, categoria: categoriaDefault };
      });

      console.log('\nItens processados:', menuItems.map(item => ({
        nome: item.nome,
        categoriaId: item.categoriaId,
        categoriaNome: item.categoria?.nome
      })));
      
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
      console.log('Dados do formulário recebidos:', formData);

      let processedData = { ...formData };

      // Se a categoria é uma string, tenta encontrar ou criar a categoria
      if (typeof formData.categoria === 'string') {
        console.log('Categoria é uma string, buscando ou criando categoria:', formData.categoria);
        const categoria = await CategoriaService.getOrCreateCategoria(formData.categoria);
        console.log('Categoria encontrada/criada:', categoria);
        processedData = {
          ...processedData,
          categoria,
          categoriaId: categoria.id
        };
      } else if (formData.categoria && typeof formData.categoria === 'object' && 'id' in formData.categoria) {
        // Se já é um objeto categoria, apenas garante que o categoriaId está correto
        console.log('Categoria é um objeto:', formData.categoria);
        processedData = {
          ...processedData,
          categoriaId: formData.categoria.id
        };
      }

      console.log('Dados formatados para envio:', processedData);

      if ('id' in processedData) {
        await ItemService.updateItem(processedData);
      } else {
        await ItemService.createItem(processedData);
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
              <TableCell>Categoria</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.nome}</TableCell>
                <TableCell>{item.descricao}</TableCell>
                <TableCell>R$ {item.preco.toFixed(2)}</TableCell>
                <TableCell>{getCategoriaDisplay(item.categoria)}</TableCell>
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