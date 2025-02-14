import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Typography,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { Item } from '../services/itemService';

interface ItemTableProps {
  items: Item[];
  onAdd: (item: Item) => void;
  onRemove: (itemId: number) => void;
  onQuickView: (item: Item) => void;
  getItemQuantity: (itemId: number) => number;
}

const ItemTable: React.FC<ItemTableProps> = ({
  items,
  onAdd,
  onRemove,
  onQuickView,
  getItemQuantity
}) => {
  return (
    <TableContainer component={Paper} elevation={0}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Item</TableCell>
            <TableCell>Nome</TableCell>
            <TableCell align="right">Preço</TableCell>
            <TableCell align="center">Quantidade</TableCell>
            <TableCell align="center">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.id}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
              }}
            >
              <TableCell component="th" scope="row" sx={{ width: 100 }}>
                {item.imagemUrl && (
                  <Box
                    component="img"
                    src={item.imagemUrl}
                    alt={item.nome}
                    sx={{
                      width: 60,
                      height: 60,
                      objectFit: 'cover',
                      borderRadius: 1
                    }}
                  />
                )}
              </TableCell>
              <TableCell>
                <Stack spacing={1}>
                  <Typography
                    sx={{
                      fontFamily: '"Playfair Display", serif',
                      fontWeight: 600
                    }}
                  >
                    {item.nome}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontFamily: '"Roboto", sans-serif',
                      fontSize: '0.875rem'
                    }}
                  >
                    {item.descricao}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell align="right">
                <Typography
                  sx={{
                    fontFamily: '"Montserrat", sans-serif',
                    fontWeight: 600,
                    color: 'primary.main'
                  }}
                >
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(item.preco)}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  justifyContent="center"
                >
                  <IconButton
                    onClick={() => onRemove(item.id)}
                    disabled={getItemQuantity(item.id) === 0}
                    size="small"
                    sx={{
                      color: 'primary.main',
                      bgcolor: 'primary.light',
                      '&:hover': {
                        bgcolor: 'primary.light',
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography
                    sx={{
                      fontFamily: '"Montserrat", sans-serif',
                      fontWeight: 600,
                      minWidth: 30
                    }}
                  >
                    {getItemQuantity(item.id)}
                  </Typography>
                  <IconButton
                    onClick={() => onAdd(item)}
                    size="small"
                    sx={{
                      color: 'primary.main',
                      bgcolor: 'primary.light',
                      '&:hover': {
                        bgcolor: 'primary.light',
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </TableCell>
              <TableCell align="center">
                <IconButton
                  onClick={() => onQuickView(item)}
                  size="small"
                  sx={{
                    color: 'primary.main',
                    '&:hover': {
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  <VisibilityIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ItemTable;