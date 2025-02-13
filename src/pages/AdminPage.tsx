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
  DialogTitle
} from '@mui/material';
import itemService, { Item } from '../services/itemService';
import categoriaService, { Categoria } from '../services/categoriaService';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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
      // Primeiro carrega todas as categorias
      const categorias = await categoriaService.getCategorias();
      //console.log('Categorias carregadas:', categorias.map(c => ({
      //  id: c.id,
      //  tipo: typeof c.id,
      //  nome: c.nome
      //})));

      // Depois carrega os itens
      const loadedItems = await itemService.getItems();
      //console.log('Itens carregados:', loadedItems.map(item => ({
      //  nome: item.nome,
      //  categoriaId: item.categoriaId,
      //  tipoCategoriaId: typeof item.categoriaId
      //})));
      
      // Associa as categorias corretas aos itens
      const itemsWithCategories = loadedItems.map(item => {
        //console.log('\n=== Processando item:', item.nome, '===');
        
        // Primeiro tenta pelo categoriaId
        if (item.categoriaId !== undefined && item.categoriaId !== null) {
          console.log('Tentando encontrar categoria com ID:', item.categoriaId);
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

      console.log('\nItens processados:', itemsWithCategories.map(item => ({
        nome: item.nome,
        categoriaId: item.categoriaId,
        categoriaNome: item.categoria?.nome
      })));
      
      setItems(itemsWithCategories);
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
      setError('Erro ao carregar itens. Por favor, tente novamente.');
    }
  };

  const getCategoriaDisplay = (categoria: string | Categoria | undefined): string => {
    if (!categoria) {
      //console.log('Categoria undefined, retornando "Sem Categoria"');
      return 'Sem Categoria';
    }
    
    if (typeof categoria === 'string') {
      //console.log('Categoria é string:', categoria);
      return categoria;
    }
    
    if ('nome' in categoria) {
      //console.log('Categoria é objeto com nome:', categoria.nome);
      return categoria.nome;
    }
    
    //console.log('Categoria inválida:', categoria);
    return 'Sem Categoria';
  };

  const handleEdit = (item: Item) => {
    if (!item) {
      console.error('Tentativa de editar um item undefined');
      setError('Erro ao editar item: item não encontrado');
      return;
    }

    console.log('Item para edição:', item);
    console.log('Categoria do item:', item.categoria);

    // Garante que o item tenha uma categoria válida
    let categoriaNome: string;
    if (item.categoria && typeof item.categoria === 'object' && 'nome' in item.categoria) {
      console.log('Usando nome da categoria do objeto:', item.categoria.nome);
      categoriaNome = item.categoria.nome;
    } else if (item.categoria && typeof item.categoria === 'string') {
      console.log('Usando categoria string:', item.categoria);
      categoriaNome = item.categoria;
    } else {
      console.log('Usando categoria padrão');
      categoriaNome = 'Sem Categoria';
    }

    console.log('Nome da categoria extraído:', categoriaNome);

    // Mantém o objeto categoria completo no editingItem
    setEditingItem({
      ...item,
      categoria: item.categoria // Mantém o objeto categoria original
    });

    // Define o nome da categoria no formData
    setFormData({
      nome: item.nome || '',
      descricao: item.descricao || '',
      preco: item.preco?.toString() || '',
      categoria: categoriaNome,
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
      // Primeiro cria/obtém a categoria
      const categoria = await itemService.getOrCreateCategoria(formData.categoria);
      console.log('Categoria obtida/criada:', categoria);

      const itemData = {
        nome: formData.nome,
        descricao: formData.descricao,
        preco: Number(formData.preco),
        categoria: categoria, // Usa o objeto categoria completo
        imagemUrl: editingItem?.imagemUrl || ''
      };

      let createdOrUpdatedItem: Item;

      // Se tem imagem nova, faz o upload primeiro
      if (formData.imagem) {
        // Se está editando, usa o ID existente, senão cria o item primeiro
        if (editingItem) {
          console.log('Iniciando upload da imagem para item existente...', {
            itemId: editingItem.id,
            fileName: formData.imagem.name,
            fileSize: formData.imagem.size,
            fileType: formData.imagem.type
          });

          const imageUrl = await itemService.uploadImage(editingItem.id, formData.imagem);
          console.log('Imagem enviada:', imageUrl);
          
          // Atualiza o item com todos os dados novos incluindo a imagem e categoria
          createdOrUpdatedItem = await itemService.updateItem({
            ...editingItem,
            ...itemData,
            categoria: categoria, // Garante que a categoria está correta
            imagemUrl: imageUrl
          });
        } else {
          // Cria o item primeiro com a categoria correta
          createdOrUpdatedItem = await itemService.createItem({
            ...itemData,
            categoria: categoria // Garante que a categoria está correta
          });
          console.log('Item criado:', createdOrUpdatedItem);

          // Faz upload da imagem
          console.log('Iniciando upload da imagem para novo item...', {
            itemId: createdOrUpdatedItem.id,
            fileName: formData.imagem.name,
            fileSize: formData.imagem.size,
            fileType: formData.imagem.type
          });

          const imageUrl = await itemService.uploadImage(createdOrUpdatedItem.id, formData.imagem);
          console.log('Imagem enviada:', imageUrl);

          // Atualiza o item com a URL da imagem mantendo a categoria
          createdOrUpdatedItem = await itemService.updateItem({
            ...createdOrUpdatedItem,
            categoria: categoria, // Garante que a categoria está correta
            imagemUrl: imageUrl
          });
        }
      } else {
        // Se não tem imagem nova, apenas cria/atualiza o item normalmente
        if (editingItem) {
          createdOrUpdatedItem = await itemService.updateItem({
            ...editingItem,
            ...itemData,
            categoria: categoria // Garante que a categoria está correta
          });
        } else {
          createdOrUpdatedItem = await itemService.createItem({
            ...itemData,
            categoria: categoria // Garante que a categoria está correta
          });
        }
      }

      setSuccess(true);
      handleCancel(); // Limpa o formulário
      await loadItems(); // Recarrega a lista
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
