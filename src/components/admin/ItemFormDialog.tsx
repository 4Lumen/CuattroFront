import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box
} from '@mui/material';
import { CreateMenuItem, MenuItem } from './MenuConfiguration';

interface ItemFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (item: CreateMenuItem | MenuItem) => Promise<void>;
  item?: MenuItem;
}

const ItemFormDialog: React.FC<ItemFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  item
}) => {
  const [formData, setFormData] = React.useState<CreateMenuItem>({
    nome: '',
    descricao: '',
    preco: 0,
    categoria: '',
    imagemUrl: ''
  });

  useEffect(() => {
    if (item) {
      setFormData({
        nome: item.nome,
        descricao: item.descricao,
        preco: item.preco,
        categoria: item.categoria,
        imagemUrl: item.imagemUrl
      });
    } else {
      setFormData({
        nome: '',
        descricao: '',
        preco: 0,
        categoria: '',
        imagemUrl: ''
      });
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (item) {
      await onSubmit({
        ...formData,
        id: item.id
      });
    } else {
      await onSubmit(formData);
    }
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'preco' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{item ? 'Editar Item' : 'Novo Item'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              name="nome"
              label="Nome"
              value={formData.nome}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="descricao"
              label="Descrição"
              value={formData.descricao}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              name="preco"
              label="Preço"
              type="number"
              value={formData.preco}
              onChange={handleChange}
              required
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
            />
            <TextField
              name="categoria"
              label="Categoria"
              value={formData.categoria}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="imagemUrl"
              label="URL da Imagem"
              value={formData.imagemUrl}
              onChange={handleChange}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">
            {item ? 'Salvar' : 'Criar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ItemFormDialog;
