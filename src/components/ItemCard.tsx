import React from 'react';
import { Card, CardContent, CardMedia, Typography, IconButton, Box } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { Item } from '../services/itemService';

interface ItemCardProps {
  item: Item;
  quantity: number;
  onAddToCart: () => void;
  onRemoveFromCart: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, quantity, onAddToCart, onRemoveFromCart }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {item.imagemUrl && (
        <CardMedia
          component="img"
          height="200"
          image={item.imagemUrl}
          alt={item.nome}
          sx={{ objectFit: 'cover' }}
        />
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {item.nome}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {item.descricao}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
          R$ {item.preco.toFixed(2)}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <IconButton 
            onClick={onRemoveFromCart} 
            disabled={quantity === 0}
            color="primary"
          >
            <RemoveIcon />
          </IconButton>
          <Typography sx={{ mx: 2 }}>
            {quantity}
          </Typography>
          <IconButton 
            onClick={onAddToCart}
            color="primary"
          >
            <AddIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ItemCard; 