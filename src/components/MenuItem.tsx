import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Box
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { Item } from '../services/itemService';

interface MenuItemProps {
  item: Item;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, quantity, onAdd, onRemove }) => {
  return (
    <Card>
      {item.imagemUrl && (
        <CardMedia
          component="img"
          height="140"
          image={item.imagemUrl}
          alt={item.nome}
        />
      )}
      <CardContent>
        <Typography variant="h6" component="div">
          {item.nome}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {item.descricao}
        </Typography>
        <Typography variant="h6" color="primary">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(item.preco)}
        </Typography>
      </CardContent>
      <CardActions>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton 
            onClick={onRemove} 
            disabled={quantity === 0}
            aria-label="Remover do carrinho"
          >
            <RemoveIcon />
          </IconButton>
          <Typography>{quantity}</Typography>
          <IconButton 
            onClick={onAdd}
            aria-label="Adicionar ao carrinho"
          >
            <AddIcon />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
};

export default MenuItem; 