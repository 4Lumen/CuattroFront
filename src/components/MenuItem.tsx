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
  Stack
} from '@mui/material';
import { 
  Add as AddIcon, 
  Remove as RemoveIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { Item } from '../services/itemService';

interface MenuItemProps {
  item: Item;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  onQuickView?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ 
  item, 
  quantity, 
  onAdd, 
  onRemove,
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
                  backgroundColor: 'transparent',
                  color: 'background.paper',
                  border: 2,
                  borderColor: 'background.paper',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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

          {item.descricao && (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                fontFamily: '"Roboto", sans-serif',
                fontSize: '0.875rem',
                mb: 1
              }}
            >
              {item.descricao}
            </Typography>
          )}

          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              fontFamily: '"Roboto", sans-serif',
              fontSize: '0.875rem',
              mb: 1,
              fontStyle: 'italic'
            }}
          >
            {item.quantidade} {item.unidadeMedida}
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
            onClick={onRemove} 
            disabled={quantity === 0}
            aria-label="Remover do carrinho"
            sx={{
              color: 'primary.main',
              border: 1,
              borderColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                transform: 'scale(1.1)'
              },
              '&.Mui-disabled': {
                borderColor: 'action.disabled',
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
            onClick={onAdd}
            aria-label="Adicionar ao carrinho"
            sx={{
              color: 'primary.main',
              border: 1,
              borderColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                transform: 'scale(1.1)'
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

export default MenuItem;