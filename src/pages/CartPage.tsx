import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Snackbar,
  Alert,
  TextField
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { useCart } from '../hooks/useCart';
import PedidoService from '../services/pedidoService';
import AuthService from '../services/authService';

const CartPage: React.FC = () => {
  const { items, total, addToCart, decrementFromCart, clearCart } = useCart();
  const [user, setUser] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState<string>('Dinheiro');
  const [enderecoEntrega, setEnderecoEntrega] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Erro ao obter usuário:", error);
        setError("Erro ao obter informações do usuário. Por favor, tente novamente.");
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return (
      <Container>
        <Typography variant="h5" align="center" sx={{ mt: 4 }}>
          Por favor, faça login para continuar
        </Typography>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container>
        <Typography variant="h5" align="center" sx={{ mt: 4 }}>
          Seu carrinho está vazio
        </Typography>
      </Container>
    );
  }

  const handleFinalizarPedido = async () => {
    try {
      if (!enderecoEntrega.trim()) {
        throw new Error('Por favor, informe o endereço de entrega');
      }

      setLoading(true);
      setError(null);
      console.log('Iniciando finalização do pedido...');
      
      if (items.length === 0) {
        throw new Error('O carrinho está vazio');
      }

      await PedidoService.createPedido(items, formaPagamento, enderecoEntrega);
      console.log('Pedido criado com sucesso');
      clearCart();
      setSuccess(true);
      setOpenDialog(false);
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Erro ao finalizar pedido. Por favor, tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        Seu Carrinho
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell align="right">Preço Unitário</TableCell>
              <TableCell align="center">Quantidade</TableCell>
              <TableCell align="right">Subtotal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(({ item, quantity }) => (
              <TableRow key={item.id}>
                <TableCell component="th" scope="row">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {item.imagemUrl && (
                      <Box
                        component="img"
                        src={item.imagemUrl}
                        alt={item.nome}
                        sx={{ width: 50, height: 50, objectFit: 'cover', marginRight: 2 }}
                      />
                    )}
                    <Box>
                      <Typography variant="subtitle1">{item.nome}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.descricao}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  R$ {item.preco.toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconButton 
                      onClick={() => decrementFromCart(item.id)}
                      size="small"
                      color="primary"
                      disabled={quantity === 0}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography sx={{ mx: 2 }}>
                      {quantity}
                    </Typography>
                    <IconButton 
                      onClick={() => addToCart(item, 1)}
                      size="small"
                      color="primary"
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  R$ {(item.preco * quantity).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} align="right">
                <Typography variant="h6">Total</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="h6">
                  R$ {total.toFixed(2)}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => setOpenDialog(true)}
          disabled={loading}
        >
          {loading ? 'Processando...' : 'Finalizar Pedido'}
        </Button>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Finalizar Pedido</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3, mt: 1 }}>
            <TextField
              fullWidth
              label="Endereço de Entrega"
              value={enderecoEntrega}
              onChange={(e) => setEnderecoEntrega(e.target.value)}
              multiline
              rows={2}
              required
              error={!enderecoEntrega.trim()}
              helperText={!enderecoEntrega.trim() ? 'Endereço é obrigatório' : ''}
            />
          </Box>
          <FormControl component="fieldset">
            <Typography variant="subtitle1" gutterBottom>
              Forma de Pagamento
            </Typography>
            <RadioGroup
              value={formaPagamento}
              onChange={(e) => setFormaPagamento(e.target.value)}
            >
              <FormControlLabel value="Dinheiro" control={<Radio />} label="Dinheiro" />
              <FormControlLabel value="Cartao" control={<Radio />} label="Cartão" />
              <FormControlLabel value="Pix" control={<Radio />} label="PIX" />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Cancelar
          </Button>
          <Button 
            onClick={handleFinalizarPedido} 
            color="primary" 
            disabled={loading || !enderecoEntrega.trim()}
          >
            {loading ? 'Processando...' : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={success} 
        autoHideDuration={6000} 
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success">
          Pedido realizado com sucesso!
        </Alert>
      </Snackbar>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CartPage; 