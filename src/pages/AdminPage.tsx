import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper,
  TextField,
  Button,
  Box,
  Alert,
  InputAdornment,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Autocomplete
} from '@mui/material';
import itemService, { Item } from '../services/itemService';
import categoriaService, { Categoria } from '../services/categoriaService';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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

const AdminPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const categorias = await categoriaService.getCategorias();
      const loadedItems = await itemService.getItems();
      
      const itemsWithCategories = loadedItems.map(item => {
        if (item.categoriaId !== undefined && item.categoriaId !== null) {
          const itemCategoriaId = Number(item.categoriaId);
          const categoria = categorias.find(c => {
            const categoriaId = Number(c.id);
            const match = categoriaId === itemCategoriaId;
            return match;
          });

          if (categoria) {
            return { ...item, categoria };
          }
        }
        
        if (item.categoria && typeof item.categoria === 'object' && 'id' in item.categoria) {
          const categoriaId = Number(item.categoria.id);
          const categoria = categorias.find(c => Number(c.id) === categoriaId);
          if (categoria) {
            return { ...item, categoria };
          }
        }
        
        if (item.categoria && typeof item.categoria === 'string') {
          const categoriaNome = item.categoria;
          const categoria = categorias.find(c => 
            c.nome && c.nome.toLowerCase() === categoriaNome.toLowerCase()
          );
          if (categoria) {
            return { ...item, categoria };
          }
        }
        
        const categoriaDefault = { 
          id: 0, 
          nome: 'Sem Categoria', 
          descricao: 'Sem Categoria', 
          ordem: 0, 
          ativa: true 
        };
        return { ...item, categoria: categoriaDefault };
      });
      
      setItems(itemsWithCategories);
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
      setError('Erro ao carregar itens. Por favor, tente novamente.');
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

  const handleEdit = (item: Item) => {
    if (!item) {
      console.error('Tentativa de editar um item undefined');
      setError('Erro ao editar item: item não encontrado');
      return;
    }

    let categoriaNome: string;
    if (item.categoria && typeof item.categoria === 'object' && 'nome' in item.categoria) {
      categoriaNome = item.categoria.nome;
    } else if (item.categoria && typeof item.categoria === 'string') {
      categoriaNome = item.categoria;
    } else {
      categoriaNome = 'Sem Categoria';
    }

    setEditingItem({
      ...item,
      categoria: item.categoria
    });

    setFormData({
      nome: item.nome || '',
      descricao: item.descricao || '',
      preco: item.preco?.toString() || '',
      categoria: categoriaNome,
      unidadeMedida: item.unidadeMedida || '',
      quantidade: item.quantidade?.toString() || '0',
      imagem: null
    });

    setSelectedFileName('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingItem(null);
    setFormData({
      nome: '',
      descricao: '',
      preco: '',
      categoria: '',
      unidadeMedida: '',
      quantidade: '0',
      imagem: null
    });
    setSelectedFileName('');
    setError(null);
  };

  const [formData, setFormData] = useState<{
    nome: string;
    descricao: string;
    preco: string;
    categoria: string;
    unidadeMedida: string;
    quantidade: string;
    imagem: File | null;
  }>({
    nome: '',
    descricao: '',
    preco: '',
    categoria: '',
    unidadeMedida: '',
    quantidade: '0',
    imagem: null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        imagem: file
      }));
      setSelectedFileName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const categoria = await itemService.getOrCreateCategoria(formData.categoria);

      const itemData = {
        nome: formData.nome,
        descricao: formData.descricao,
        preco: Number(formData.preco),
        unidadeMedida: formData.unidadeMedida,
        quantidade: Number(formData.quantidade),
        categoria: categoria,
        imagemUrl: editingItem?.imagemUrl || ''
      };

      let createdOrUpdatedItem: Item;

      if (formData.imagem) {
        if (editingItem) {
          const imageUrl = await itemService.uploadImage(editingItem.id, formData.imagem);
          
          createdOrUpdatedItem = await itemService.updateItem({
            ...editingItem,
            ...itemData,
            categoria: categoria,
            imagemUrl: imageUrl
          });
        } else {
          createdOrUpdatedItem = await itemService.createItem({
            ...itemData,
            categoria: categoria,
            disponivel: true,
            destaque: false,
            ordem: 0,
            tags: []
          });

          const imageUrl = await itemService.uploadImage(createdOrUpdatedItem.id, formData.imagem);

          createdOrUpdatedItem = await itemService.updateItem({
            ...createdOrUpdatedItem,
            categoria: categoria,
            imagemUrl: imageUrl
          });
        }
      } else {
        if (editingItem) {
          createdOrUpdatedItem = await itemService.updateItem({
            ...editingItem,
            ...itemData,
            categoria: categoria
          });
        } else {
          createdOrUpdatedItem = await itemService.createItem({
            ...itemData,
            categoria: categoria,
            disponivel: true,
            destaque: false,
            ordem: 0,
            tags: []
          });
        }
      }

      setSuccess(true);
      handleCancel();
      await loadItems();
    } catch (error) {
      console.error('Erro ao salvar item:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Erro ao salvar item. Por favor, tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (item: Item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    setLoading(true);
    setError(null);
    try {
      await itemService.deleteItem(itemToDelete.id);
      setSuccess(true);
      await loadItems();
    } catch (error) {
      console.error('Erro ao deletar item:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Erro ao deletar item. Por favor, tente novamente.');
      }
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {editingItem ? 'Editar Item' : 'Adicionar Novo Item'}
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="Nome"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              required
              fullWidth
            />

            <TextField
              label="Nova Categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleInputChange}
              required
              fullWidth
              helperText="Digite o nome da nova categoria"
            />

            <TextField
              label="Preço"
              name="preco"
              type="number"
              value={formData.preco}
              onChange={handleInputChange}
              required
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
              }}
            />

            <Box className="flex flex-col">
              <Typography variant="subtitle2" color="text.secondary" className="mb-2">
                Imagem do Item
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={handleImagemChange}
                style={{ display: 'none' }}
                id="imagem-upload"
              />
              <label htmlFor="imagem-upload">
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                  className="mb-2"
                >
                  Escolher Imagem
                </Button>
              </label>
              {selectedFileName && (
                <Typography variant="caption" color="text.secondary">
                  Arquivo selecionado: {selectedFileName}
                </Typography>
              )}
            </Box>

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

            <TextField
              label="Quantidade"
              name="quantidade"
              type="number"
              value={formData.quantidade}
              onChange={handleInputChange}
              required
              fullWidth
              inputProps={{ min: 0 }}
            />

            <TextField
              label="Descrição"
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              multiline
              rows={4}
              fullWidth
              className="md:col-span-2"
            />
          </Box>

          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : editingItem ? (
                'Atualizar Item'
              ) : (
                'Adicionar Item'
              )}
            </Button>

            {editingItem && (
              <Button
                type="button"
                variant="outlined"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancelar
              </Button>
            )}
          </Box>
        </form>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Item {editingItem ? 'atualizado' : 'adicionado'} com sucesso!
          </Alert>
        )}
      </Paper>

      {/* Lista de Itens */}
      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Itens Cadastrados
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Imagem</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Categoria</TableCell>
                <TableCell>Preço</TableCell>
                <TableCell>Un. Medida</TableCell>
                <TableCell>Qtd.</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.imagemUrl ? (
                      <img
                        src={item.imagemUrl}
                        alt={item.nome}
                        style={{ width: 50, height: 50, objectFit: 'cover' }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          bgcolor: 'grey.200',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <ImageNotSupportedIcon />
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>{item.nome}</TableCell>
                  <TableCell>{getCategoriaDisplay(item.categoria)}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(item.preco)}
                  </TableCell>
                  <TableCell>{item.unidadeMedida}</TableCell>
                  <TableCell>{item.quantidade}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        onClick={() => handleEdit(item)}
                        color="primary"
                        title="Editar"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteClick(item)}
                        color="error"
                        title="Deletar"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog de Confirmação de Deleção */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir o item "{itemToDelete?.nome}"? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Excluir'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPage;
