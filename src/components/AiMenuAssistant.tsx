import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  TextField,
  CircularProgress,
  Tooltip,
  Popover,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack
} from '@mui/material';
import { SmartToy as SmartToyIcon } from '@mui/icons-material';
import OpenAiService, { AiMenuSuggestion } from '../services/openAiService';
import { Item } from '../services/itemService';

interface AiMenuAssistantProps {
  items: Item[];
  onAddToCart: (item: Item, quantity: number) => void;
}

const AiMenuAssistant: React.FC<AiMenuAssistantProps> = ({ items, onAddToCart }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<AiMenuSuggestion | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setError(null);
    setSuggestion(null);
    setInput('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setSuggestion(null);

    try {
      const suggestion = await OpenAiService.getMenuSuggestions(input, items);
      setSuggestion(suggestion);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to get suggestions');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuggestedItems = () => {
    if (!suggestion) return;
    
    suggestion.items.forEach(item => {
      const menuItem = items.find(i => i.id === item.itemId);
      if (menuItem) {
        onAddToCart(menuItem, item.quantity);
      }
    });
    
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Tooltip title="Assistente de Menu IA">
        <IconButton
          onClick={handleClick}
          sx={{
            color: 'primary.main',
            border: 1,
            borderColor: 'primary.main',
            mr: 1,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          <SmartToyIcon />
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: 400,
            p: 2,
          }
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontFamily: '"Playfair Display", serif',
            fontWeight: 600
          }}
        >
          AI Menu Assistant
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Descreva o que você procura (ex: 'Preciso de comida para 10 pessoas, incluindo opções vegetarianas')"
            disabled={loading}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || !input.trim()}
              endIcon={<SmartToyIcon />}
            >
              Obter Sugestões
            </Button>
          </Box>

          {loading && (
            <Box display="flex" justifyContent="center" my={2}>
              <CircularProgress size={24} />
            </Box>
          )}

          {error && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          {suggestion && (
            <Box sx={{ mb: 2 }}>
              <List dense>
                {suggestion.items.map((item) => {
                  const menuItem = items.find(i => i.id === item.itemId);
                  if (!menuItem) return null;

                  return (
                    <ListItem key={item.itemId}>
                      <ListItemText
                        primary={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body1">{menuItem.nome}</Typography>
                            <Chip
                              label={`× ${item.quantity}`}
                              size="small"
                              color="primary"
                            />
                          </Stack>
                        }
                        secondary={item.reasoning}
                      />
                    </ListItem>
                  );
                })}
              </List>

              {suggestion.dietaryNotes && suggestion.dietaryNotes.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Notas Nutricionais:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {suggestion.dietaryNotes.map((note, index) => (
                      <Chip
                        key={index}
                        label={note}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" color="primary">
                  Estimated Total: {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(suggestion.totalEstimate)}
                </Typography>
              </Box>

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Tooltip title="Adicionar todos os itens sugeridos ao carrinho">
                  <IconButton
                    color="primary"
                    onClick={handleAddSuggestedItems}
                    sx={{
                      border: 1,
                      borderColor: 'primary.main'
                    }}
                  >
                    <SmartToyIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          )}
        </form>
      </Popover>
    </>
  );
};

export default AiMenuAssistant;