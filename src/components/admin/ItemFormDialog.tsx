import React, { useState } from 'react';
import ErrorBoundary from '../ErrorBoundary';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import { Item } from '../../types';

interface ItemFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (item: Item & { categoria: string }) => void;
  item?: Item & { categoria: string };
}

const ItemFormDialog: React.FC<ItemFormDialogProps> = ({ open, onClose, onSubmit, item }) => {
  const [nome, setNome] = useState(item?.nome || '');
  const [descricao, setDescricao] = useState(item?.descricao || '');
  const [preco, setPreco] = useState(item?.preco || 0);
  const [categoria, setCategoria] = useState(item?.categoria || '');
  const [imagemUrl, setImagemUrl] = useState(item?.imagemUrl || '');

  const handleSubmit = () => {
    onSubmit({
      id: item?.id || 0,
      nome,
      descricao,
      preco,
      categoria,
      imagemUrl
    });
  };

  return (
    <ErrorBoundary>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{item ? 'Editar Item' : 'Adicionar Novo Item'}</DialogTitle>
        <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            fullWidth
            required
            inputProps={{
              'aria-label': 'Item name',
              'data-testid': 'item-name-input'
            }}
            error={!nome}
            helperText={!nome ? 'Name is required' : ''}
          />
          <TextField
            label="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            fullWidth
            multiline
            rows={3}
            inputProps={{
              'aria-label': 'Item description',
              'data-testid': 'item-description-input'
            }}
          />
          <TextField
            label="Preço"
            type="number"
            value={preco}
            onChange={(e) => setPreco(Number(e.target.value))}
            fullWidth
            required
            inputProps={{
              'aria-label': 'Item price',
              'data-testid': 'item-price-input',
              min: 0,
              step: 0.01
            }}
            InputProps={{
              startAdornment: 'R$'
            }}
            error={preco <= 0}
            helperText={preco <= 0 ? 'Price must be greater than 0' : ''}
          />
          <FormControl fullWidth>
            <InputLabel id="category-label">Categoria</InputLabel>
            <Select
              value={categoria}
              label="Categoria"
              onChange={(e) => setCategoria(e.target.value)}
              required
              inputProps={{
                'aria-labelledby': 'category-label',
                'data-testid': 'item-category-select'
              }}
              error={!categoria}
            >
              <MenuItem value="Entrada">Entrada</MenuItem>
              <MenuItem value="Principal">Principal</MenuItem>
              <MenuItem value="Sobremesa">Sobremesa</MenuItem>
              <MenuItem value="Bebida">Bebida</MenuItem>
            </Select>
            {!categoria && <Box sx={{ color: 'error.main', fontSize: '0.75rem' }}>Category is required</Box>}
          </FormControl>
          <TextField
            label="URL da Imagem"
            value={imagemUrl}
            onChange={(e) => setImagemUrl(e.target.value)}
            fullWidth
            inputProps={{
              'aria-label': 'Item image URL',
              'data-testid': 'item-image-url-input'
            }}
            error={!!imagemUrl && !/^(https?:\/\/).+\.(jpg|jpeg|png|gif)$/i.test(imagemUrl)}
            helperText={!!imagemUrl && !/^(https?:\/\/).+\.(jpg|jpeg|png|gif)$/i.test(imagemUrl) 
              ? 'Must be a valid image URL (http/https) ending with .jpg, .jpeg, .png, or .gif' 
              : ''}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Salvar
        </Button>
      </DialogActions>
      </Dialog>
    </ErrorBoundary>
  );
}

export default ItemFormDialog;
