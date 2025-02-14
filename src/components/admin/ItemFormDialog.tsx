import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControlLabel,
  Switch,
  Chip,
  IconButton,
  InputAdornment,
  Autocomplete
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
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
    unidadeMedida: '',
    quantidade: 0,
    categoria: '',
    imagemUrl: '',
    disponivel: true,
    destaque: false,
    ordem: 0,
    tags: []
  });

  const [newTag, setNewTag] = React.useState('');
  
  const commonUnits = [
    'kg',
    'g',
    'ml',
    'l',
    'unidade',
    'pacote',
    'caixa',
    'dúzia'
  ];

  useEffect(() => {
    if (item) {
      setFormData({
        nome: item.nome,
        descricao: item.descricao,
        preco: item.preco,
        unidadeMedida: item.unidadeMedida || '',
        quantidade: item.quantidade || 0,
        categoria: item.categoria,
        imagemUrl: item.imagemUrl,
        disponivel: item.disponivel ?? true,
        destaque: item.destaque ?? false,
        ordem: item.ordem ?? 0,
        tags: item.tags || []
      });
    } else {
      setFormData({
        nome: '',
        descricao: '',
        preco: 0,
        unidadeMedida: '',
        quantidade: 0,
        categoria: '',
        imagemUrl: '',
        disponivel: true,
        destaque: false,
        ordem: 0,
        tags: []
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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              name === 'preco' || name === 'quantidade' || name === 'ordem' ? parseFloat(value) || 0 : 
              value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
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
            <Box sx={{ display: 'flex', gap: 2 }}>
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
              <Autocomplete
                freeSolo
                fullWidth
                options={commonUnits}
                value={formData.unidadeMedida}
                onChange={(event, newValue) => {
                  setFormData(prev => ({
                    ...prev,
                    unidadeMedida: newValue || ''
                  }));
                }}
                onInputChange={(event, newInputValue) => {
                  setFormData(prev => ({
                    ...prev,
                    unidadeMedida: newInputValue
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="unidadeMedida"
                    label="Unidade de Medida"
                    required
                    fullWidth
                  />
                )}
              />
            </Box>
            <TextField
              name="quantidade"
              label="Quantidade"
              type="number"
              value={formData.quantidade}
              onChange={handleChange}
              required
              fullWidth
              inputProps={{ min: 0 }}
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
            <TextField
              name="ordem"
              label="Ordem"
              type="number"
              value={formData.ordem}
              onChange={handleChange}
              fullWidth
              inputProps={{ min: 0 }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.disponivel}
                    onChange={handleChange}
                    name="disponivel"
                  />
                }
                label="Disponível"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.destaque}
                    onChange={handleChange}
                    name="destaque"
                  />
                }
                label="Destaque"
              />
            </Box>
            <TextField
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              label="Tags"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleAddTag} edge="end">
                      <AddIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
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
