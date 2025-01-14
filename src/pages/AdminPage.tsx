import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  IconButton
} from '@mui/material';
import { useAppContext } from '../context/AppContext';
import itemService from '../services/itemService';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import EditIcon from '@mui/icons-material/Edit';
import type { Item } from '../types';

const categorias = [
  'Salgados',
  'Doces',
  'Bebidas',
  'Decoração',
  'Pratos Quentes'
];

const AdminPage: React.FC = () => {
  const { dispatch } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const loadedItems = await itemService.getItems();
      setItems(loadedItems);
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
    }
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setFormData({
      nome: item.nome || '',
      descricao: item.descricao || '',
      preco: item.preco.toString(),
      categoria: item.categoria,
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
    imagem: File | null;
  }>({
    nome: '',
    descricao: '',
    preco: '',
    categoria: '',
    imagem: null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoriaChange = (e: any) => {
    setFormData(prev => ({
      ...prev,
      categoria: e.target.value
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
      // Validações básicas
      if (!formData.nome.trim()) {
        throw new Error('Por favor, insira um nome para o item');
      }
      if (!formData.categoria) {
        throw new Error('Por favor, selecione uma categoria');
      }
      if (!formData.preco) {
        throw new Error('Por favor, insira um preço');
      }

      const preco = parseFloat(formData.preco);
      if (isNaN(preco) || preco <= 0) {
        throw new Error('Por favor, insira um preço válido maior que zero');
      }

      // Formata os dados para envio
      const itemData = {
        nome: formData.nome.trim() || '',
        descricao: formData.descricao.trim() || '',
        preco: Number(preco.toFixed(2)),
        categoria: formData.categoria,
        imagemUrl: editingItem?.imagemUrl || ''
      };

      let updatedItem;

      if (editingItem) {
        // Atualizar item existente
        updatedItem = await itemService.updateItem({
          ...editingItem,
          ...itemData
        });
        console.log('Item atualizado:', updatedItem);
      } else {
        // Criar novo item
        updatedItem = await itemService.createItem(itemData);
        console.log('Item criado:', updatedItem);
      }

      // Se houver imagem, fazer o upload
      if (formData.imagem) {
        console.log('Iniciando upload da imagem...', {
          itemId: updatedItem.id,
          fileName: formData.imagem.name,
          fileSize: formData.imagem.size,
          fileType: formData.imagem.type
        });

        try {
          const imagemUrl = await itemService.uploadImage(updatedItem.id, formData.imagem);
          console.log('Imagem enviada:', imagemUrl);

          console.log('Aguardando processamento da imagem...');
          await new Promise(resolve => setTimeout(resolve, 5000));

          try {
            updatedItem = await itemService.updateItem({
              ...updatedItem,
              imagemUrl
            });
            console.log('Item atualizado com imagem:', updatedItem);
          } catch (updateError) {
            console.error('Erro ao atualizar item com URL da imagem:', updateError);
            setError('Item salvo com sucesso, mas houve um erro ao vincular a imagem.');
            return;
          }
        } catch (uploadError) {
          console.error('Erro no upload da imagem:', uploadError);
          setError(uploadError instanceof Error ? uploadError.message : 'Erro ao fazer upload da imagem.');
          return;
        }
      }

      // Limpar o formulário
      handleCancel();
      setSuccess(true);

      // Atualizar a lista de itens
      await loadItems();

    } catch (error) {
      console.error('Erro ao salvar item:', error);
      setError(error instanceof Error ? error.message : 'Erro ao salvar item');
    } finally {
      setLoading(false);
    }
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

            <FormControl fullWidth required>
              <InputLabel>Categoria</InputLabel>
              <Select
                value={formData.categoria}
                onChange={handleCategoriaChange}
                label="Categoria"
              >
                {categorias.map(cat => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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
                        alt={item.nome || 'Item sem nome'}
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
                  <TableCell>{item.nome || 'Sem nome'}</TableCell>
                  <TableCell>{item.categoria}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(item.preco)}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEdit(item)}
                      color="primary"
                      title="Editar"
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default AdminPage;
