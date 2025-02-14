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
  Snackbar,
  Alert
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { useCart } from '../hooks/useCart';
import { generateOrderPDF } from '../services/pdfService';

const CartPage: React.FC = () => {
  const { items, total, addToCart, decrementFromCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <Container>
        <Typography variant="h5" align="center" sx={{ mt: 4 }}>
          Seu carrinho está vazio
        </Typography>
      </Container>
    );
  }

  const handleFinalizarPedido = () => {
    try {
      setLoading(true);
      generateOrderPDF(items);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Erro ao gerar o PDF. Por favor, tente novamente.');
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
                    <Typography variant="subtitle1">{item.nome}</Typography>
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
                      sx={{
                        color: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)'
                        }
                      }}
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
                      sx={{
                        color: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)'
                        }
                      }}
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
              <TableCell colSpan={4} align="right">
                <Typography variant="h6">
                  Total R$ {total.toFixed(2)}
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
          onClick={handleFinalizarPedido}
          disabled={loading}
          sx={{
            minWidth: 200,
            '&.Mui-disabled': {
              backgroundColor: 'primary.main',
              opacity: 0.7
            }
          }}
        >
          {loading ? 'Gerando PDF...' : 'Finalizar Pedido'}
        </Button>
      </Box>

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