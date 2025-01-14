import React, { useState, useEffect } from 'react';
import ErrorBoundary from '../ErrorBoundary';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  CircularProgress, 
  Alert 
} from '@mui/material';
import { Item } from '../../types';
import ItemService from '../../services/itemService';
import ItemFormDialog from './ItemFormDialog';

type MenuItem = Item & {
  categoria: string;
};

const MenuConfiguration: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | undefined>(undefined);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const items = await ItemService.getItems();
      // Map items to include categoria field
      const menuItems = items.map(item => ({
        ...item,
        categoria: (item as any).categoria || 'Geral'
      }));
      setMenuItems(menuItems);
    } catch (error) {
      setError('Failed to fetch menu items');
      console.error(error);
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
      fetchMenuItems();
    } catch (error) {
      setError('Failed to delete item');
      console.error(error);
    }
  };

  const handleFormSubmit = async (item: MenuItem) => {
    try {
      if (item.id) {
        await ItemService.updateItem(item);
      } else {
        await ItemService.createItem(item);
      }
      fetchMenuItems();
      setIsFormOpen(false);
    } catch (error) {
      setError('Failed to save item');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={fetchMenuItems} sx={{ mt: 2 }}>
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Menu Configuration
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleAddItem}
          aria-label="Add new menu item"
          data-testid="add-item-button"
        >
          Add New Item
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table aria-label="Menu items table">
          <TableHead>
            <TableRow>
              <TableCell aria-sort="none">Nome</TableCell>
              <TableCell aria-sort="none">Descrição</TableCell>
              <TableCell aria-sort="none">Preço</TableCell>
              <TableCell aria-sort="none">Categoria</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {menuItems.map((item: MenuItem) => (
              <TableRow 
                key={item.id}
                aria-labelledby={`item-${item.id}-name`}
                data-testid={`menu-item-${item.id}`}
              >
                <TableCell id={`item-${item.id}-name`}>{item.nome}</TableCell>
                <TableCell>{item.descricao}</TableCell>
                <TableCell>R${item.preco.toFixed(2)}</TableCell>
                <TableCell>{item.categoria}</TableCell>
                <TableCell>
                  <Button 
                    size="small" 
                    color="primary"
                    onClick={() => handleEditItem(item)}
                    aria-label={`Edit ${item.nome}`}
                    data-testid={`edit-item-${item.id}`}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    color="error"
                    onClick={() => handleDeleteItem(item.id)}
                    aria-label={`Delete ${item.nome}`}
                    data-testid={`delete-item-${item.id}`}
                  >
                    Delete
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

export default MenuConfiguration;
