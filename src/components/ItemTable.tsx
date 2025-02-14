import React, { useState, useMemo } from 'react';
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
  Stack,
  TextField,
  TableSortLabel,
  Popover,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Visibility as VisibilityIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { Item } from '../services/itemService';

interface ItemTableProps {
  items: Item[];
  onAdd: (item: Item) => void;
  onRemove: (itemId: number) => void;
  onQuickView: (item: Item) => void;
  getItemQuantity: (itemId: number) => number;
}

type SortDirection = 'asc' | 'desc';
type SortableFields = 'nome' | 'preco' | 'unidadeMedida';

interface SortConfig {
  key: SortableFields | null;
  direction: SortDirection;
}

interface FilterAnchor {
  element: HTMLElement | null;
  field: SortableFields | null;
}

interface Filters {
  nome: string;
  preco: string;
  unidadeMedida: string;
}

const ItemTable: React.FC<ItemTableProps> = ({
  items,
  onAdd,
  onRemove,
  onQuickView,
  getItemQuantity
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState<Filters>({
    nome: '',
    preco: '',
    unidadeMedida: ''
  });
  const [filterAnchor, setFilterAnchor] = useState<FilterAnchor>({ element: null, field: null });

  const handleSort = (key: SortableFields) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>, field: SortableFields) => {
    setFilterAnchor({
      element: event.currentTarget,
      field
    });
  };

  const handleFilterClose = () => {
    setFilterAnchor({ element: null, field: null });
  };

  const handleFilterChange = (field: SortableFields, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];

    // Apply filters
    result = result.filter(item => {
      const matchNome = item.nome.toLowerCase().includes(filters.nome.toLowerCase());
      const matchPreco = filters.preco === '' || item.preco.toString().includes(filters.preco);
      const matchUnidade = item.unidadeMedida.toLowerCase().includes(filters.unidadeMedida.toLowerCase());
      return matchNome && matchPreco && matchUnidade;
    });

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc'
            ? aValue - bValue
            : bValue - aValue;
        }
        
        return 0;
      });
    }

    return result;
  }, [items, sortConfig, filters]);

  const renderSortLabel = (key: SortableFields, label: string) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <TableSortLabel
        active={sortConfig.key === key}
        direction={sortConfig.key === key ? sortConfig.direction : 'asc'}
        onClick={() => handleSort(key)}
        IconComponent={sortConfig.direction === 'asc' ? ArrowUpwardIcon : ArrowDownwardIcon}
      >
        {label}
      </TableSortLabel>
      <Tooltip title="Filtrar">
        <IconButton 
          size="small" 
          onClick={(e) => handleFilterClick(e, key)}
          sx={{ ml: 1 }}
        >
          <FilterListIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );

  return (
    <>
      <TableContainer component={Paper} elevation={0}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ pl: 2 }}>Item</TableCell>
              <TableCell align="left">
                {renderSortLabel('nome', 'Nome')}
              </TableCell>
              <TableCell align="left">
                {renderSortLabel('preco', 'Preço')}
              </TableCell>
              <TableCell align="left">
                {renderSortLabel('unidadeMedida', 'Un. Medida')}
              </TableCell>
              <TableCell align="center">Quantidade</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedItems.map((item) => (
              <TableRow
                key={item.id}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                }}
              >
                <TableCell component="th" scope="row" sx={{ width: 100, pl: 2 }}>
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
                <TableCell align="left">
                  <Typography
                    sx={{
                      fontFamily: '"Playfair Display", serif',
                      fontWeight: 600
                    }}
                  >
                    {item.nome}
                  </Typography>
                </TableCell>
                <TableCell align="left">
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
                <TableCell align="left">
                  <Typography
                    sx={{
                      fontFamily: '"Roboto", sans-serif',
                      fontSize: '0.875rem',
                      fontStyle: 'italic'
                    }}
                  >
                    {item.quantidade} {item.unidadeMedida}
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
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          transform: 'scale(1.1)'
                        }
                      }}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <TextField
                      size="small"
                      type="number"
                      value={getItemQuantity(item.id)}
                      onChange={(e) => {
                        if (e.target.value === '') return;
                        
                        const newValue = Math.max(0, parseInt(e.target.value) || 0);
                        const currentValue = getItemQuantity(item.id);
                        
                        if (newValue === currentValue) return;
                        
                        const difference = newValue - currentValue;
                        if (difference > 0) {
                          for (let i = 0; i < difference; i++) {
                            onAdd(item);
                          }
                        } else {
                          for (let i = 0; i < Math.abs(difference); i++) {
                            onRemove(item.id);
                          }
                        }
                      }}
                      inputProps={{
                        min: 0,
                        style: {
                          textAlign: 'center',
                          width: '50px',
                          padding: '4px',
                          fontFamily: '"Montserrat", sans-serif',
                          fontWeight: 600
                        }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'primary.light',
                          },
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          }
                        }
                      }}
                    />
                    <IconButton
                      onClick={() => onAdd(item)}
                      size="small"
                      sx={{
                        color: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
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

      <Popover
        open={Boolean(filterAnchor.element)}
        anchorEl={filterAnchor.element}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2, minWidth: 200 }}>
          <Typography variant="subtitle2" gutterBottom>
            Filtrar por {filterAnchor.field === 'nome' ? 'nome' : 
                        filterAnchor.field === 'preco' ? 'preço' : 
                        'unidade de medida'}
          </Typography>
          {filterAnchor.field && (
            <TextField
              fullWidth
              size="small"
              value={filters[filterAnchor.field]}
              onChange={(e) => handleFilterChange(filterAnchor.field!, e.target.value)}
              placeholder="Digite para filtrar..."
              autoFocus
            />
          )}
        </Box>
      </Popover>
    </>
  );
};

export default ItemTable;