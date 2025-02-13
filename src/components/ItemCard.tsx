import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Box,
  Button,
  Chip,
  Fade,
  Stack,
  TextField
} from '@mui/material';
import { 
  Add as AddIcon, 
  Remove as RemoveIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { Item } from '../services/itemService';

interface ItemCardProps {
  item: Item;
  quantity: number;
  onAddToCart: () => void;
  onRemoveFromCart: () => void;
  onQuickView?: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  quantity,
  onAddToCart,
  onRemoveFromCart,
  onQuickView
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.1)'
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        {item.imagemUrl && (
          <CardMedia
            component="img"
            height="200"
            image={item.imagemUrl}
            alt={item.nome}
            sx={{
              objectFit: 'cover'
            }}
          />
        )}
        
        <Fade in={isHovered}>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {onQuickView && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<VisibilityIcon />}
                onClick={onQuickView}
                sx={{
                  bgcolor: 'background.paper',
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: 'background.paper',
                    transform: 'scale(1.05)'
                  }
                }}
              >
                Visualizar
              </Button>
            )}
          </Box>
        </Fade>
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Stack spacing={1}>
          {item.categoria && (
            <Chip
              label={typeof item.categoria === 'string' ? item.categoria : item.categoria.nome}
              size="small"
              sx={{
                alignSelf: 'flex-start',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                fontFamily: '"Roboto Condensed", sans-serif',
                fontWeight: 400
              }}
            />
          )}

          <Typography 
            variant="h6" 
            component="div"
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 600,
              fontSize: '1.25rem',
              mb: 1
            }}
          >
            {item.nome}
          </Typography>

          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              fontFamily: '"Roboto", sans-serif',
              fontSize: '0.875rem',
              mb: 2
            }}
          >
            {item.descricao}
          </Typography>

          <Typography 
            variant="h6" 
            sx={{
              fontFamily: '"Montserrat", sans-serif',
              fontWeight: 600,
              color: 'primary.main',
              fontSize: '1.5rem'
            }}
          >
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(item.preco)}
          </Typography>
        </Stack>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Stack 
          direction="row" 
          spacing={1} 
          alignItems="center"
          sx={{ width: '100%' }}
        >
          <IconButton 
            onClick={onRemoveFromCart}
            disabled={quantity === 0}
            aria-label="Remover do carrinho"
            sx={{
              '&.Mui-disabled': {
                color: 'action.disabled'
              }
            }}
          >
            <RemoveIcon />
          </IconButton>

          <Typography 
            sx={{ 
              flex: 1,
              textAlign: 'center',
              fontFamily: '"Montserrat", sans-serif',
              fontWeight: 600
            }}
          >
            {quantity}
          </Typography>

          <IconButton 
            onClick={onAddToCart}
            aria-label="Adicionar ao carrinho"
            sx={{ 
              p: 1,
              bgcolor: 'transparent',
              '&:hover': {
                bgcolor: 'transparent'
              }
            }}
          >
            <AddIcon />
          </IconButton>
        </Stack>
      </CardActions>
    </Card>
  );
};

export default ItemCard;