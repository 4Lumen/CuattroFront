import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  IconButton,
  Box
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { Item } from '../types';

interface MenuItemProps {
  item: Item;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
};

const MenuItem: React.FC<MenuItemProps> = ({ item, quantity, onAdd, onRemove }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardMedia
        component="img"
        height="200"
        image={item.imagemUrl ?? '/placeholder-food.jpg'}
        alt={item.nome ?? 'Imagem do item'}
        className="h-48 object-cover"
      />
      <CardContent className="flex-grow flex flex-col">
        <Typography variant="h6" component="h3" className="font-bold mb-2">
          {item.nome}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          className="mb-4 flex-grow"
        >
          {item.descricao}
        </Typography>
        <Box className="flex items-center justify-between mt-auto">
          <Typography variant="h6" color="primary" className="font-bold">
            {formatPrice(item.preco)}
          </Typography>
          <Box className="flex items-center">
            {quantity > 0 ? (
              <>
                <IconButton
                  size="small"
                  onClick={onRemove}
                  className="text-gray-600"
                >
                  <RemoveIcon />
                </IconButton>
                <Typography variant="body1" className="mx-2">
                  {quantity}
                </Typography>
                <IconButton
                  size="small"
                  onClick={onAdd}
                  color="primary"
                >
                  <AddIcon />
                </IconButton>
              </>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={onAdd}
                startIcon={<AddIcon />}
                size="small"
              >
                Adicionar
              </Button>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MenuItem; 