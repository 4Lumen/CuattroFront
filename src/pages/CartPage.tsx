import React, { useState } from 'react';
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
  Alert
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { useCart } from '../hooks/useCart';
import PedidoService from '../services/pedidoService';

const CartPage: React.FC = () => {
  const { items, total, addToCart, decrementFromCart, clearCart } = useCart();
  const [openDialog, setOpenDialog] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState<string>('Dinheiro');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
      setLoading(true);
      setError(null);
      console.log('Iniciando finalização do pedido...');
      
      if (items.length === 0) {
        throw new Error('O carrinho está vazio');
      }

      await PedidoService.createPedido(items, formaPagamento);
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
        <DialogTitle>Forma de Pagamento</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset">
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
          <Button onClick={handleFinalizarPedido} color="primary" disabled={loading}>
            Confirmar
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